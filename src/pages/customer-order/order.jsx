import { getCustomerOrders } from "@/apis/customer-order.api";
import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import { DateTimeByTextRender } from "@/components/common/aggridreact/cellRender";
import { CustomerOrder } from "@/components/common/aggridreact/dbColumns";
import { useCustomToast } from "@/components/common/custom-toast";
import { DatePickerWithRangeInForm } from "@/components/common/date-range-picker";
import { InvoiceTemplate } from "@/components/common/invoice/template";
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
import { Input } from "@/components/common/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/common/ui/select";
import { ViewOrderDetail } from "@/components/customer-order/ViewOrderDetail";
import useFetchData from "@/hooks/useRefetchData";
import { useSetData } from "@/hooks/useSetData";
import { useToggle } from "@/hooks/useToggle";
import { setGlobalLoading } from "@/redux/slice/globalLoadingSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays } from "date-fns";
import { ArrowRightToLine, Printer, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { z } from "zod";

const formSchema = z
  .object({
    from: z.date({
      required_error: "Vui lòng chọn khoảng thời gian!"
    }),
    to: z.date({
      required_error: "Vui lòng chọn khoảng thời gian!"
    })
  })
  .refine(data => data.from <= data.to, {
    message: "Ngày bắt đầu không được lớn hơn ngày kết thúc!",
    path: ["to_date"]
  });
export function Order() {
  const gridRef = useRef(null);
  const toast = useCustomToast();
  const paymentRef = useRef(null);
  const [openSheet, setOpen] = useToggle(false);
  const [openPrint, setOpenPrint] = useToggle(false);
  const [paymentInfo, setPaymentInfo] = useState({});
  const CUSTOMER_ORDER = new CustomerOrder();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "all",
      orderType: "all",
      from: addDays(new Date(), -30),
      to: addDays(new Date(), 30)
    }
  });

  const { data: orders, loading } = useFetchData({ service: getCustomerOrders });
  const [rowData, setRowData] = useSetData(orders);
  console.log("rowData", rowData);
  // const [rowData, setRowData] = useSetData([]);
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
      headerName: CUSTOMER_ORDER.ORDER.ID.headerName,
      field: CUSTOMER_ORDER.ORDER.ID.field,
      flex: 0.75,
      filter: true
    },
    {
      headerName: CUSTOMER_ORDER.ORDER.CREATED_AT.headerName,
      field: CUSTOMER_ORDER.ORDER.CREATED_AT.field,
      flex: 0.75,
      filter: true,
      cellRenderer: DateTimeByTextRender
    },
    {
      headerName: CUSTOMER_ORDER.ORDER_TYPE.headerName,
      field: CUSTOMER_ORDER.ORDER_TYPE.field,
      flex: 0.5,
      filter: true,
      cellRenderer: params => {
        if (!!params.data.ORDER_TYPE) {
          if (params.data.ORDER_TYPE === "EXPORT")
            return (
              <Badge className="rounded-sm border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200">
                Xuất
                <ArrowRightToLine className="ml-1" size={16} />
              </Badge>
            );
          else if (params.data.ORDER_TYPE === "IMPORT")
            return (
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
      headerName: CUSTOMER_ORDER.PAYMENT.ID.headerName,
      field: CUSTOMER_ORDER.PAYMENT.ID.field,
      flex: 0.75,
      filter: true,
      cellRenderer: params => {
        return (
          <div className="flex items-center gap-2">
            <Printer
              size={16}
              className="mr-1 flex-none cursor-pointer text-blue-600"
              onClick={() => {
                setPaymentInfo(params.data);
                setOpenPrint(true);
              }}
            />
            <p className="flex-1">{params.data.PAYMENT.ID}</p>
          </div>
        );
      }
    },

    {
      headerName: CUSTOMER_ORDER.PAYMENT.TOTAL_AMOUNT.headerName,
      field: CUSTOMER_ORDER.PAYMENT.TOTAL_AMOUNT.field,
      flex: 0.5
    },

    {
      headerName: CUSTOMER_ORDER.ORDER_STATUS.headerName,
      field: CUSTOMER_ORDER.ORDER_STATUS.field,
      minWidth: 175,
      maxWidth: 175,
      cellRenderer: params => {
        if (params.data.ORDER_STATUS === "CANCELLED") {
          return (
            <Badge className="rounded-sm border-transparent bg-red-100 font-normal text-red-800 hover:bg-red-200">
              Đã hủy
            </Badge>
          );
        } else if (params.data.ORDER_STATUS === "PENDING") {
          return (
            <Badge className="rounded-sm border-transparent  bg-yellow-100 font-normal text-yellow-800 hover:bg-yellow-200">
              Chờ thanh toán
            </Badge>
          );
        } else if (params.data.ORDER_STATUS === "IN_PROGRESS") {
          return (
            <Badge className="rounded-sm border-transparent bg-blue-100 font-normal text-blue-800 hover:bg-blue-200">
              Đang xử lý
            </Badge>
          );
        } else if (params.data.ORDER_STATUS === "COMPLETED") {
          return (
            <Badge className="rounded-sm border-transparent bg-green-100 font-normal text-green-800 hover:bg-green-200">
              {params.data.ORDER_TYPE === "EXPORT" && "Đã xuất kho"}
              {params.data.ORDER_TYPE === "IMPORT" && "Đã nhập kho"}
            </Badge>
          );
        } else {
          return (
            <Badge className="rounded-sm border-transparent bg-gray-100 font-normal text-gray-800 hover:bg-gray-200">
              Không xác định
            </Badge>
          );
        }
      }
    },
    {
      headerName: "",
      flex: 0.45,
      filter: true,
      cellStyle: { alignContent: "space-evenly" },
      cellRenderer: params => {
        return (
          <Button
            variant="link"
            size="xs"
            className="text-xs text-blue-700 hover:text-blue-800"
            onClick={() => {
              setPaymentInfo(params.data);
              setOpen(true);
            }}
          >
            Chi tiết
          </Button>
        );
      }
    }
  ];
  const handlePrintInvoice = useReactToPrint({
    content: () => paymentRef.current,
    onBeforePrint: () => {
      dispatch(setGlobalLoading(true));
    },
    onAfterPrint: () => {
      dispatch(setGlobalLoading(false));
    }
  });

  useEffect(() => {
    if (openPrint) {
      handlePrintInvoice();
      setOpenPrint(false);
    }
  }, [openPrint, handlePrintInvoice]);

  const onSubmit = values => {
    dispatch(setGlobalLoading(true));
    let { status, orderType, orderId, from, to } = form.getValues();
    //exclude empty value from { status, orderType, searchBy, orderId } = form.getValues()
    const filteredValues = Object.fromEntries(
      Object.entries({ status, orderType, orderId, from, to }).filter(
        ([_, v]) => v != null && v !== "" && v !== "all"
      )
    );

    getCustomerOrders(filteredValues)
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
    <>
      <ViewOrderDetail open={openSheet} setOpen={setOpen} paymentInfo={paymentInfo} />
      <InvoiceTemplate
        key={paymentInfo?.PAYMENT?.ID}
        ref={paymentRef}
        paymentInfo={paymentInfo}
        isCustomer
      />
      <Section>
        <Section.Header title="Danh sách đơn hàng" />
        <Section.Content>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex items-end justify-start gap-2"
            >
              <FormField
                control={form.control}
                name="orderId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nhập mã đơn hàng</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nhập tên mã đơn hàng" className="w-[300px]" />
                    </FormControl>
                    <FormMessage>{form.formState.errors?.orderId?.message}</FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng thái</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all" className="text-gray-800">
                            Tất cả
                          </SelectItem>
                          <SelectItem value="PENDING" className="text-yellow-800">
                            Chờ thanh toán
                          </SelectItem>
                          <SelectItem value="IN_PROGRESS" className="text-blue-800">
                            Đang xử lý
                          </SelectItem>
                          <SelectItem value="COMPLETED" className="text-green-800">
                            Đã hoàn thành
                          </SelectItem>
                          <SelectItem value="CANCELLED" className="text-red-800">
                            Đã hủy
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="orderType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại lệnh</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Chọn loại lệnh" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all" className="text-gray-800">
                            Tất cả
                          </SelectItem>
                          <SelectItem value="IMPORT">Nhập</SelectItem>
                          <SelectItem value="EXPORT">Xuất</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage>{form.formState.errors?.orderType?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="from"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tìm kiếm theo ngày</FormLabel>
                    <FormControl>
                      <DatePickerWithRangeInForm
                        className="h-9 [&_div]:text-[14px]"
                        date={{ from: form.getValues("from"), to: form.getValues("to") }}
                        onSelected={value => {
                          form.setValue("from", value?.from, { shouldValidate: true });
                          form.setValue("to", value?.to, { shouldValidate: true });
                        }}
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors?.from?.message || form.formState.errors?.to?.message}
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
    </>
  );
}
