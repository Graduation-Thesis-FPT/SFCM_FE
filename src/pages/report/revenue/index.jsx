import { getAllCustomer } from "@/apis/customer.api";
import { viewInvoice } from "@/apis/order.api";
import { getPayment } from "@/apis/payment.api";
import { getReportRevenue } from "@/apis/report.api";
import { getAllUser } from "@/apis/user.api";
import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import {
  DateTimeByTextRender,
  StatusOrderPaymentRender
} from "@/components/common/aggridreact/cellRender";
import { BtnExportExcel } from "@/components/common/aggridreact/tableTools/BtnExportExcel";
import { LayoutTool } from "@/components/common/aggridreact/tableTools/LayoutTool";
import { useCustomToast } from "@/components/common/custom-toast";
import { DatePickerWithRangeInForm } from "@/components/common/date-range-picker";
import { InvoiceTemplate } from "@/components/common/invoice/template";
import { Section } from "@/components/common/section";
import { SelectSearch } from "@/components/common/select-search";
import { Badge } from "@/components/common/ui/badge";
import { Button } from "@/components/common/ui/button";
import { Input } from "@/components/common/ui/input";
import { Label } from "@/components/common/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/common/ui/select";
import useFetchData from "@/hooks/useRefetchData";
import { formatVnd } from "@/lib/utils";
import { setGlobalLoading } from "@/redux/slice/globalLoadingSlice";
import { addDays } from "date-fns";
import { ArrowRightToLine, Search } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useReactToPrint } from "react-to-print";

export function Revenue() {
  const gridRef = useRef();
  const toast = useCustomToast();
  const dispatch = useDispatch();

  const { data: customerList, loading: loadingCustomerList } = useFetchData({
    service: getAllCustomer
  });

  const { data: userList } = useFetchData({
    service: getAllUser
  });
  const [filter, setFilter] = useState({
    fromDate: addDays(new Date(), -30),
    toDate: addDays(new Date(), 30),
    TYPE: "all",
    CUSTOMER_ID: "",
    PAYMENT_ID: ""
  });

  const [rowData, setRowData] = useState([]);
  console.log("🚀 ~ Revenue ~ rowData:", rowData);
  const pinnedBottomRowData = useMemo(() => {
    return [
      {
        ACC_CD: "BOTTOM (ACC_CD)"
      }
    ];
  }, []);
  const colDefs = [
    {
      cellClass: params => {
        if (params.node.rowPinned) {
          return "bg-gray-200";
        }
        return "text-gray-600 bg-gray-50 text-center";
      },
      width: 60,
      comparator: (valueA, valueB, nodeA, nodeB, isDescending) => {
        return nodeA.rowIndex - nodeB.rowIndex;
      },
      valueFormatter: params => {
        if (params.node.rowPinned) {
          return "";
        }
        return Number(params.node.id) + 1;
      }
    },
    {
      cellClass: params => {
        if (params.node.rowPinned) {
          return "bg-gray-200";
        }
      },
      headerName: "Mã hóa đơn",
      field: "ID",
      flex: 1,
      filter: true
    },
    {
      cellClass: params => {
        if (params.node.rowPinned) {
          return "bg-gray-200";
        }
      },
      headerName: "Tên khách hàng",
      field: "FULLNAME",
      flex: 1,
      filter: true
    },
    {
      cellClass: params => {
        if (params.node.rowPinned) {
          return "bg-gray-200";
        }
      },
      headerName: "Loại đơn hàng",
      field: "TYPE",
      flex: 0.7,
      cellRenderer: params => {
        if (!!params.value) {
          if (params.value === "XK")
            return (
              <Badge className="rounded-sm border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200">
                Xuất
                <ArrowRightToLine className="ml-1" size={16} />
              </Badge>
            );
          else if (params.value === "NK")
            return (
              <Badge className="rounded-sm border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200">
                <ArrowRightToLine className="mr-1" size={16} />
                Nhập
              </Badge>
            );
        }
      }
    },
    {
      cellClass: params => {
        if (params.node.rowPinned) {
          return "bg-gray-200 text-end font-bold ";
        }
      },
      headerName: "Ngày hoàn thành",
      field: "DatePayment",
      flex: 1,
      cellRenderer: params => {
        return DateTimeByTextRender(params);
      }
    },
    {
      cellClass: params => {
        if (params.node.rowPinned) {
          return "bg-gray-200 text-end font-bold ";
        }
      },
      headerName: "Trạng thái thanh toán",
      field: "STATUS",
      minWidth: 180,
      maxWidth: 180,
      cellRenderer: StatusOrderPaymentRender
    },
    {
      cellClass: params => {
        if (params.node.rowPinned) {
          return "bg-gray-200 text-end font-bold ";
        }
      },
      headerName: "Người thu tiền",
      field: "cashier",
      flex: 1,
      colSpan: params => (params.node.rowPinned ? 2 : 1),
      cellRenderer: params => {
        if (params.node.rowPinned) {
          let allTAMOUNT = rowData.reduce((a, b) => {
            return a + b.TOTAL_AMOUNT;
          }, 0);
          return `Tổng: ${formatVnd(allTAMOUNT)}`.replace("VND", "");
        }

        let temp = userList?.find(item => item.USERNAME === params.value);
        if (temp?.FULLNAME) {
          return temp.FULLNAME;
        } else {
          return params.value;
        }
      }
    },

    {
      cellClass: "text-end",
      headerClass: "number-header",
      headerName: "Tổng tiền (VND)",
      field: "TOTAL_AMOUNT",
      flex: 1,
      cellRenderer: params => {
        return formatVnd(params.value).replace("VND", "");
      }
    },

    {
      cellClass: params => {
        if (params.node.rowPinned) {
          return "bg-gray-200 text-end font-bold";
        }
        return "text-center";
      },
      flex: 0.6,
      cellRenderer: params => {
        if (params.node.rowPinned) {
          let sl = rowData.length;
          return `SL: ${sl}`;
        }
        return (
          <Button
            variant="link"
            onClick={() => {
              handleGetPaymentInfo(params.data);
              // handleViewInvoice(params.data.ID);
            }}
            className="cursor-pointer text-sm font-medium text-blue-700 hover:text-blue-700/80"
          >
            Hóa đơn
          </Button>
        );
      }
    }
  ];

  const getRowData = () => {
    dispatch(setGlobalLoading(true));
    getReportRevenue(filter)
      .then(res => {
        if (!res.data.metadata.length) {
          setRowData([]);
          toast.error("Không tìm thấy dữ liệu!");
          return;
        }
        toast.success(res);
        setRowData(res.data.metadata);
      })
      .catch(err => {
        setRowData([]);
        toast.error(err);
      })
      .finally(() => {
        dispatch(setGlobalLoading(false));
      });
  };
  const paymentRef = useRef(null);
  const handlePrintInvoice = useReactToPrint({
    content: () => paymentRef.current,

    onAfterPrint: () => {
      dispatch(setGlobalLoading(false));
    }
  });
  const [paymentInfo, setPaymentInfo] = useState(null);

  const handleGetPaymentInfo = data => {
    dispatch(setGlobalLoading(true));
    getPayment({
      orderId: data.order_ID,
      orderType: data.TYPE === "NK" ? "IMPORT" : "EXPORT",
      status: "PAID"
    })
      .then(res => {
        if (!res.data.metadata.length) {
          toast.error("Không tìm thấy dữ liệu!");
          return;
        }
        setPaymentInfo(res.data.metadata[0]);
      })
      .then(() => {
        setTimeout(() => {
          handlePrintInvoice();
        }, 200);
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
      <InvoiceTemplate key={paymentInfo?.PAYMENT?.ID} ref={paymentRef} paymentInfo={paymentInfo} />

      <Section.Header>
        <div className="grid grid-cols-5 items-end gap-3">
          <div>
            <Label htmlFor="PAYMENT_ID">Mã hóa đơn</Label>
            <Input
              id="PAYMENT_ID"
              placeholder="Nhập mã hóa đơn"
              value={filter.PAYMENT_ID}
              maxLength={50}
              onChange={e => {
                setFilter({ ...filter, PAYMENT_ID: e.target.value?.trim()?.toUpperCase() });
              }}
              onKeyPress={e => {
                if (e.key === "Enter") {
                  getRowData();
                }
              }}
            />
          </div>
          <div>
            <Label htmlFor="CUSTOMER_ID">Khách hàng *</Label>
            <SelectSearch
              id="CUSTOMER_ID"
              className="w-full"
              labelSelect={loadingCustomerList ? "Đang tải dữ liệu..." : "Chọn khách hàng"}
              value={filter.CUSTOMER_ID}
              data={customerList?.map(item => {
                return {
                  value: item.ID,
                  label: `${item.ID + " - " + item.FULLNAME}`
                };
              })}
              onSelect={value => {
                setFilter({ ...filter, CUSTOMER_ID: value });
              }}
            />
          </div>

          <div>
            <Label htmlFor="TYPE">Loại đơn hàng *</Label>
            <Select
              id="TYPE"
              value={filter.TYPE}
              onValueChange={value => {
                setFilter({ ...filter, TYPE: value });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn khách hàng" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="NK">Nhập</SelectItem>
                  <SelectItem value="XK">Xuất</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="from-to">Ngày hoàn thành *</Label>
            <DatePickerWithRangeInForm
              className="w-full"
              id="from-to"
              date={{ from: filter.fromDate, to: filter.toDate }}
              onSelected={value => {
                setFilter({ ...filter, fromDate: value?.from, toDate: value?.to });
              }}
            />
          </div>
          <div className="text-end">
            <Button onClick={getRowData} className="h-[36px] w-fit">
              Tìm kiếm
              <Search className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      </Section.Header>
      <Section.Content>
        <div className="flex items-end justify-between">
          <span className="text-lg font-bold">Danh sách các hóa đơn</span>
          <LayoutTool>
            <BtnExportExcel gridRef={gridRef} />
          </LayoutTool>
        </div>
        <Section.Table>
          <AgGrid
            setRowData={data => {
              setRowData(data);
            }}
            ref={gridRef}
            rowData={rowData}
            colDefs={colDefs}
            pinnedBottomRowData={pinnedBottomRowData}
            onGridReady={() => {
              gridRef.current.api.showLoadingOverlay();
              getRowData();
            }}
          />
        </Section.Table>
      </Section.Content>
    </Section>
  );
}
