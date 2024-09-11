import { getAllCustomer } from "@/apis/customer.api";
import { viewInvoice } from "@/apis/order.api";
import { getReportRevenue } from "@/apis/report.api";
import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import { DateTimeByTextRender } from "@/components/common/aggridreact/cellRender";
import { BtnExportExcel } from "@/components/common/aggridreact/tableTools/BtnExportExcel";
import { LayoutTool } from "@/components/common/aggridreact/tableTools/LayoutTool";
import { useCustomToast } from "@/components/common/custom-toast";
import { DatePickerWithRangeInForm } from "@/components/common/date-range-picker";
import { Section } from "@/components/common/section";
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
import { useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";

export function Revenue() {
  const gridRef = useRef();
  const toast = useCustomToast();
  const dispatch = useDispatch();

  const { data: customerList } = useFetchData({
    service: getAllCustomer
  });
  const [filter, setFilter] = useState({
    from: addDays(new Date(), -30),
    to: addDays(new Date(), 30),
    isInEx: "all",
    PAYER: "all",
    INV_NO: ""
  });

  const [rowData, setRowData] = useState([]);
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
      field: "INV_NO",
      flex: 1,
      filter: true
    },
    {
      cellClass: params => {
        if (params.node.rowPinned) {
          return "bg-gray-200";
        }
      },
      headerName: "Mã đơn hàng",
      field: "DE_ORDER_NO",
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
      field: "CUSTOMER_NAME",
      flex: 1,
      filter: true
    },
    {
      cellClass: params => {
        if (params.node.rowPinned) {
          return "bg-gray-200";
        }
      },
      headerName: "Hình thức thanh toán",
      field: "ACC_CD",
      flex: 1,
      cellRenderer: params => {
        if (params.node.rowPinned) {
          return "";
        }
        return params.value === "TM/CK"
          ? "Tiền mặt/Chuyển khoản"
          : params.value === "TM"
            ? "Tiền mặt"
            : "Chuyển khoản";
      }
    },
    {
      cellClass: params => {
        if (params.node.rowPinned) {
          return "bg-gray-200 text-end font-bold ";
        }
      },
      headerName: "Ngày hoàn thành",
      field: "INV_DATE",
      flex: 1,
      colSpan: params => (params.node.rowPinned ? 2 : 1),
      cellRenderer: params => {
        if (params.node.rowPinned) {
          let allTAMOUNT = rowData.reduce((a, b) => {
            return a + b.TAMOUNT;
          }, 0);
          return `Tổng: ${formatVnd(allTAMOUNT)}`.replace("VND", "");
        }
        return DateTimeByTextRender(params);
      }
    },
    {
      cellClass: "text-end",
      headerClass: "number-header",
      headerName: "Tổng tiền (VND)",
      field: "TAMOUNT",
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
      minWidth: 100,
      cellRenderer: params => {
        if (params.node.rowPinned) {
          let sl = rowData.length;
          return `SL: ${sl}`;
        }
        return (
          <Button
            variant="link"
            onClick={() => {
              handleViewInvoice(params.data.DE_ORDER_NO);
            }}
            className="cursor-pointer text-sm font-medium text-blue-700 hover:text-blue-700/80"
          >
            Hóa đơn
          </Button>
        );
      }
    }
  ];

  const handleViewInvoice = async fkey => {
    dispatch(setGlobalLoading(true));
    viewInvoice(fkey)
      .then(res => {
        if (!res.data.metadata.success) {
          throw new Error(res.data.metadata.error);
        }
        let base64Data = res.data.metadata.content.data;
        const blob = new Blob([new Uint8Array(base64Data).buffer], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank");
      })
      .catch(err => {
        if (err?.message?.includes("Cannot")) {
          return toast.error("Không thể xem hóa đơn. Vui lòng thử lại sau!");
        }
        toast.error(err);
      })
      .finally(() => {
        dispatch(setGlobalLoading(false));
      });
  };

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

  return (
    <Section>
      <Section.Header>
        <div className="grid grid-cols-5 items-end gap-3">
          <div>
            <Label htmlFor="INV_NO">Mã hóa đơn</Label>
            <Input
              id="INV_NO"
              placeholder="Nhập mã hóa đơn"
              value={filter.INV_NO}
              maxLength={50}
              onChange={e => {
                setFilter({ ...filter, INV_NO: e.target.value?.trim()?.toUpperCase() });
              }}
              onKeyPress={e => {
                if (e.key === "Enter") {
                  getRowData();
                }
              }}
            />
          </div>
          <div>
            <Label htmlFor="PAYER">Khách hàng *</Label>
            <Select
              id="PAYER"
              value={filter.PAYER}
              onValueChange={value => {
                setFilter({ ...filter, PAYER: value });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn khách hàng" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {customerList?.map(
                    customer =>
                      customer.IS_ACTIVE && (
                        <SelectItem key={customer.USERNAME} value={customer.CUSTOMER_CODE}>
                          {customer.CUSTOMER_CODE} - {customer.CUSTOMER_NAME}
                        </SelectItem>
                      )
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="isInEx">Loại đơn hàng *</Label>
            <Select
              id="isInEx"
              value={filter.isInEx}
              onValueChange={value => {
                setFilter({ ...filter, isInEx: value });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn khách hàng" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="I">Nhập</SelectItem>
                  <SelectItem value="E">Xuất</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="from-to">Ngày hoàn thành *</Label>
            <DatePickerWithRangeInForm
              className="w-full"
              id="from-to"
              date={{ from: filter.from, to: filter.to }}
              onSelected={value => {
                setFilter({ ...filter, from: value?.from, to: value?.to });
              }}
            />
          </div>
          <div className="text-end">
            <Button onClick={getRowData} variant="blue" className="w-fit">
              Nạp dữ liệu
            </Button>
          </div>
        </div>
      </Section.Header>
      <Section.Content>
        <LayoutTool>
          <BtnExportExcel gridRef={gridRef} />
        </LayoutTool>
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
