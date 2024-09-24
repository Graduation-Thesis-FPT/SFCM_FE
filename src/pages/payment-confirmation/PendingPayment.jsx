import {
  getCustomerOrders,
  getCustomerOrdersByFilter,
  getOrderByOrderNo
} from "@/apis/customer-order.api";
import { viewInvoice } from "@/apis/order.api";
import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import { DateTimeByTextRender } from "@/components/common/aggridreact/cellRender";
import { bs_order_tracking } from "@/components/common/aggridreact/dbColumns";
import { useCustomToast } from "@/components/common/custom-toast";
import { DatePickerWithRangeInForm } from "@/components/common/date-range-picker";
import { Section } from "@/components/common/section";
import { Badge } from "@/components/common/ui/badge";
import { Button } from "@/components/common/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/common/ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/common/ui/tooltip";
import useFetchData from "@/hooks/useRefetchData";
import { useSetData } from "@/hooks/useSetData";
import { useToggle } from "@/hooks/useToggle";
import { setGlobalLoading } from "@/redux/slice/globalLoadingSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays } from "date-fns";
import { ArrowRightToLine, Printer, Search } from "lucide-react";
import moment from "moment";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { z } from "zod";

const formSchema = z
  .object({
    from_date: z.date({
      required_error: "Vui lòng chọn khoảng thời gian!"
    }),
    to_date: z.date({
      required_error: "Vui lòng chọn khoảng thời gian!"
    })
  })
  .refine(data => data.from_date <= data.to_date, {
    message: "Ngày bắt đầu không được lớn hơn ngày kết thúc!",
    path: ["to_date"]
  });
export function PendingPayment() {
  const gridRef = useRef(null);
  const toast = useCustomToast();
  const orderDetailRef = useRef();
  const [order, setOrder] = useToggle();
  const BS_ORDER_TRACKING = new bs_order_tracking();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      from_date: addDays(new Date(), -30),
      to_date: addDays(new Date(), 30)
    }
  });
  const { data: orders, loading } = useFetchData({ service: getCustomerOrders });

  const [rowData, setRowData] = useSetData(orders);
  const dispatch = useDispatch();

  const colDefs = [
    {
      cellClass: "text-gray-600 bg-gray-50 text-center",
      flex: 0.25,
      comparator: (nodeA, nodeB) => {
        return nodeA.rowIndex - nodeB.rowIndex;
      },
      valueFormatter: params => {
        return Number(params.node.id) + 1;
      }
    },
    {
      headerName: BS_ORDER_TRACKING.DE_ORDER_NO.headerName,
      field: BS_ORDER_TRACKING.DE_ORDER_NO.field,
      flex: 1,
      filter: true
    },
    {
      headerName: "Loại lệnh",
      field: "ORDER_TYPE",
      flex: 0.5,
      filter: true,
      cellRenderer: params => {
        if (!!params.data.CONTAINER_ID) {
          return !!params.data.PACKAGE_ID ? (
            <Badge className="rounded-sm border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200">
              Xuất
              <ArrowRightToLine className="ml-1" size={16} />
            </Badge>
          ) : (
            <Badge className="rounded-sm border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200">
              <ArrowRightToLine className="mr-1" size={16} />
              Nhập
            </Badge>
          );
        }
        return (
          <Badge className="rounded-sm border-transparent bg-orange-100 text-orange-800 hover:bg-orange-200">
            Không xác định
          </Badge>
        );
      }
    },
    {
      headerName: BS_ORDER_TRACKING.TOTAL_CBM.headerName,
      field: BS_ORDER_TRACKING.TOTAL_CBM.field,
      flex: 0.5,
      filter: true
    },

    {
      headerName: BS_ORDER_TRACKING.ISSUE_DATE.headerName,
      field: BS_ORDER_TRACKING.ISSUE_DATE.field,
      flex: 1,
      cellRenderer: DateTimeByTextRender
    },
    {
      headerName: BS_ORDER_TRACKING.INV_ID.headerName,
      field: BS_ORDER_TRACKING.INV_ID.field,
      flex: 1,
      filter: true,
      cellRenderer: params => {
        return (
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger
                onClick={() => {
                  handleViewInvoice(params.data.DE_ORDER_NO);
                }}
                className="text-xs text-gray-500 hover:text-gray-800 hover:underline"
              >
                {params.data.INV_ID}
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="text-12">Xem hoá đơn</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }
    },
    {
      headerName: "Trạng thái",
      field: "IS_VALID",
      minWidth: 150,
      maxWidth: 150,
      cellRenderer: params => {
        if (params.value) {
          return (
            <Badge className="rounded-sm border-transparent bg-green-100 text-green-800 hover:bg-green-200">
              Đã thanh toán
            </Badge>
          );
        }
        return (
          <Badge className="rounded-sm border-transparent bg-red-100 text-red-800 hover:bg-red-200">
            Đã hủy
          </Badge>
        );
      }
    },
    {
      headerName: "",
      field: "ORDER_DETAIL",
      flex: 0.5,
      filter: true,
      cellStyle: { alignContent: "space-evenly" },
      cellRenderer: params => {
        return (
          <Button
            variant="ghost"
            size="xs"
            className="text-xs"
            onClick={async () => {
              await handleGetOrder(params.data.DE_ORDER_NO);
              handlePrint();
            }}
          >
            <Printer size={16} className="mr-1 text-blue-950" />
            In phiếu
          </Button>
        );
      }
    }
  ];
  const handlePrint = useReactToPrint({
    content: () => orderDetailRef.current,
    onBeforePrint: () => dispatch(setGlobalLoading(true)),
    onAfterPrint: () => dispatch(setGlobalLoading(false))
  });

  const handleViewInvoice = deliveryOrderNO => {
    dispatch(setGlobalLoading(true));
    viewInvoice(deliveryOrderNO)
      .then(res => {
        let base64Data = res.data.metadata.content.data;
        const blob = new Blob([new Uint8Array(base64Data).buffer], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank");
      })
      .catch(err => {
        toast.error(err);
      })
      .finally(() => {
        dispatch(setGlobalLoading(false));
      });
  };

  const handleGetOrder = async orderNo => {
    dispatch(setGlobalLoading(true));
    await getOrderByOrderNo({ orderNo: orderNo })
      .then(async res => {
        await setOrder(res.data.metadata);
      })
      .catch(err => {
        toast.error(err);
      })
      .finally(() => {
        dispatch(setGlobalLoading(false));
      });
  };
  const onSubmit = () => {
    dispatch(setGlobalLoading(true));
    getCustomerOrdersByFilter({
      from_date: moment(form.getValues("from_date")).startOf("day").format("Y-MM-DD HH:mm:ss"),
      to_date: moment(form.getValues("to_date")).endOf("day").format("Y-MM-DD HH:mm:ss")
    })
      .then(res => {
        setRowData(res.data.metadata);
      })
      .catch(err => {
        toast.error(err);
      })
      .finally(() => {
        dispatch(setGlobalLoading(false));
      });
  };
  return (
    <Section>
      <Section.Header title="Danh sách đơn hàng chờ thanh toán" />

      <Section.Content>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-end justify-start gap-2"
          >
            <FormField
              control={form.control}
              name="from_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tìm kiếm theo ngày</FormLabel>
                  <FormControl>
                    <DatePickerWithRangeInForm
                      date={{ from: form.getValues("from_date"), to: form.getValues("to_date") }}
                      onSelected={value => {
                        form.setValue("from_date", value?.from, { shouldValidate: true });
                        form.setValue("to_date", value?.to, { shouldValidate: true });
                      }}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors?.from_date?.message ||
                      form.formState.errors?.to_date?.message}
                  </FormMessage>
                </FormItem>
              )}
            />

            <Button className="h-[36px] text-xs" type="submit">
              Tìm kiếm
              <Search className="ml-2 size-4" />
            </Button>
          </form>
        </Form>
        <Section.Table>
          <AgGrid ref={gridRef} colDefs={colDefs} loading={loading} rowData={rowData} />
        </Section.Table>
      </Section.Content>
    </Section>
  );
}
