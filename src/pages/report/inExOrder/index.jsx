import { getExportOrderForDocById } from "@/apis/export-order.api";
import { getImportOrderForDocById } from "@/apis/import-order.api";
import { getPayment } from "@/apis/payment.api";
import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import { payment_confirmation } from "@/components/common/aggridreact/dbColumns";
import { useCustomToast } from "@/components/common/custom-toast";
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
import { ComponentPrintOrder } from "@/components/order/ComponentPrintOrder";
import { EditPayment } from "@/components/payment-confirmation/EditPayment";
import useFetchData from "@/hooks/useRefetchData";
import { useSetData } from "@/hooks/useSetData";
import { useToggle } from "@/hooks/useToggle";
import { formatVnd } from "@/lib/utils";
import { setGlobalLoading } from "@/redux/slice/globalLoadingSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightToLine, Printer, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { z } from "zod";

const formSchema = z.object({
  status: z.enum(["PENDING", "PAID", "CANCELLED", "all"]).optional(),
  orderType: z.enum(["IMPORT", "EXPORT", "all"]).optional(),
  searchQuery: z.string().optional(),
  orderId: z.string().optional()
});

const PAYMENT_CONFIRMATION = new payment_confirmation();

export function InExOrder() {
  const gridRef = useRef(null);
  const toast = useCustomToast();
  const orderRef = useRef(null);
  const [openSheet, setOpen] = useToggle(false);
  const [openPrint, setOpenPrint] = useToggle(false);
  const [paymentInfo, setPaymentInfo] = useState({});
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "all",
      orderType: "all",
      searchQuery: "",
      orderId: ""
    }
  });
  const {
    data: payments,
    loading,
    revalidate: revalidatePayments
  } = useFetchData({ service: getPayment });
  const [rowData, setRowData] = useSetData(payments);
  const dispatch = useDispatch();

  const [dataForPrint, setDataForPrint] = useState([]);
  const [orderSelected, setOrderSelected] = useState({});

  const handleClickToPrint = data => {
    setOrderSelected({ orderType: data.ORDER_TYPE, payStatus: data.PAYMENT.STATUS });
    if (data.ORDER_TYPE === "IMPORT") {
      getImportOrderForDocById(data.ORDER.ID)
        .then(res => {
          setDataForPrint(res.data.metadata);
        })
        .then(() => {
          setOpenPrint(true);
        })
        .catch(err => {
          toast.error(err);
        });
    } else if (data.ORDER_TYPE === "EXPORT") {
      getExportOrderForDocById(data.ORDER.ID)
        .then(res => {
          setDataForPrint(res.data.metadata);
        })
        .then(() => {
          setOpenPrint(true);
        })
        .catch(err => {
          toast.error(err);
        });
    }
  };

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
      headerName: PAYMENT_CONFIRMATION.ORDER.ID.headerName,
      field: PAYMENT_CONFIRMATION.ORDER.ID.field,
      flex: 0.75,
      filter: true,
      cellRenderer: params => {
        return (
          <div className="flex items-center gap-2">
            <Printer
              size={16}
              className="flex-none cursor-pointer text-blue-600"
              onClick={() => {
                handleClickToPrint(params.data);
              }}
            />
            <p>{params.data.PAYMENT.ID}</p>
          </div>
        );
      }
    },
    {
      headerName: PAYMENT_CONFIRMATION.ORDER.USER.FULLNAME.headerName,
      field: PAYMENT_CONFIRMATION.ORDER.USER.FULLNAME.field,
      flex: 1.5,
      filter: true
    },
    {
      headerName: PAYMENT_CONFIRMATION.ORDER_TYPE.headerName,
      field: PAYMENT_CONFIRMATION.ORDER_TYPE.field,
      flex: 0.5,
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
      headerName: PAYMENT_CONFIRMATION.PAYMENT.ID.headerName,
      field: PAYMENT_CONFIRMATION.PAYMENT.ID.field,
      filter: true,
      flex: 0.75
    },

    {
      headerName: `${PAYMENT_CONFIRMATION.PAYMENT.TOTAL_AMOUNT.headerName} (VND)`,
      field: PAYMENT_CONFIRMATION.PAYMENT.TOTAL_AMOUNT.field,
      flex: 0.75,
      filter: true,
      headerClass: "number-header",
      cellClass: "text-end",
      cellRenderer: params => formatVnd(params.value).replace("VND", "")
    },

    {
      headerName: PAYMENT_CONFIRMATION.PAYMENT.STATUS.headerName,
      field: PAYMENT_CONFIRMATION.PAYMENT.STATUS.field,
      minWidth: 175,
      maxWidth: 175,
      cellRenderer: params => {
        if (params.data.PAYMENT.STATUS === "PAID") {
          return (
            <Badge className="rounded-sm border-transparent bg-green-100 font-normal text-green-800 hover:bg-green-200">
              Đã thanh toán
            </Badge>
          );
        } else if (params.data.PAYMENT.STATUS === "CANCELLED") {
          return (
            <Badge className="rounded-sm border-transparent bg-red-100 font-normal text-red-800 hover:bg-red-200">
              Đã hủy
            </Badge>
          );
        } else if (params.data.PAYMENT.STATUS === "PENDING") {
          return (
            <Badge className="rounded-sm border-transparent  bg-yellow-100 font-normal text-yellow-800 hover:bg-yellow-200">
              Chờ thanh toán
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
      cellStyle: { alignContent: "center", textAlign: "center" },
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
    content: () => orderRef.current,
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
    const { status, orderType, searchQuery, orderId } = form.getValues();
    //exclude empty value from { status, orderType, searchBy, orderId } = form.getValues()
    const filteredValues = Object.fromEntries(
      Object.entries({ status, orderType, searchQuery, orderId }).filter(
        ([_, v]) => v != null && v !== "" && v !== "all"
      )
    );

    getPayment(filteredValues)
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

  const filterHeaderToPrint = data => {
    if (!data || !data.length) return {};
    return data[0];
  };

  return (
    <>
      <EditPayment
        readOnly={true}
        open={openSheet}
        setOpen={setOpen}
        paymentInfo={paymentInfo}
        revalidatePayments={revalidatePayments}
      />
      <ComponentPrintOrder
        ref={orderRef}
        header={filterHeaderToPrint(dataForPrint)}
        detail={dataForPrint || []}
        type={orderSelected.orderType === "IMPORT" ? "NK" : "XK"}
        statusOrder={orderSelected.payStatus}
      />
      <Section>
        <Section.Header title="Danh sách các đơn hàng" />
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
                    <FormLabel>Tìm mã đơn hàng</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nhập tên mã đơn hàng" className="w-[300px]" />
                    </FormControl>
                    <FormMessage>{form.formState.errors?.orderId?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="searchQuery"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tìm tên khách hàng</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nhập tên khách hàng" className="w-[300px]" />
                    </FormControl>
                    <FormMessage>{form.formState.errors?.searchBy?.message}</FormMessage>
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
                          <SelectItem value="PAID" className="text-green-800">
                            Đã thanh toán
                          </SelectItem>
                          <SelectItem value="CANCELLED" className="text-red-800">
                            Đã hủy
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage>{form.formState.errors?.status?.message} </FormMessage>
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
