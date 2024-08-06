import { getAllCustomer } from "@/apis/customer.api";
import { viewInvoice } from "@/apis/order.api";
import { getReportInExOrder } from "@/apis/report.api";
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
import { setGlobalLoading } from "@/redux/slice/globalLoadingSlice";
import { addDays } from "date-fns";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";

export function InExOrder() {
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
    CUSTOMER_CODE: "all",
    CNTRNO: ""
  });

  const [rowData, setRowData] = useState([]);

  const colDefs = [
    {
      cellClass: "text-gray-600 bg-gray-50 text-center",
      width: 60,
      comparator: (valueA, valueB, nodeA, nodeB, isDescending) => {
        return nodeA.rowIndex - nodeB.rowIndex;
      },
      valueFormatter: params => {
        return Number(params.node.id) + 1;
      }
    },
    {
      headerName: "Mã đơn hàng",
      field: "DE_ORDER_NO",
      flex: 1,
      filter: true
    },
    {
      headerName: "Mã hóa đơn",
      field: "INV_ID",
      flex: 1,
      filter: true
    },
    {
      headerName: "Số container",
      field: "CNTRNO",
      flex: 1,
      filter: true
    },
    {
      headerName: "Tên khách hàng",
      field: "CUSTOMER_NAME",
      flex: 1,
      filter: true
    },
    {
      headerName: "Hạn lệnh",
      field: "ISSUE_DATE",
      flex: 1,
      cellRenderer: DateTimeByTextRender
    },
    {
      flex: 0.6,
      minWidth: 100,
      cellClass: "text-center",
      cellRenderer: params => {
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
    getReportInExOrder(filter)
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
            <Label htmlFor="CNTRNO">Số container</Label>
            <Input
              id="CNTRNO"
              placeholder="Nhập số container"
              value={filter.CNTRNO}
              maxLength={11}
              onChange={e => {
                setFilter({ ...filter, CNTRNO: e.target.value?.trim()?.toUpperCase() });
              }}
              onKeyPress={e => {
                if (e.key === "Enter") {
                  getRowData();
                }
              }}
            />
          </div>
          <div>
            <Label htmlFor="CUSTOMER_CODE">Khách hàng *</Label>
            <Select
              id="CUSTOMER_CODE"
              value={filter.CUSTOMER_CODE}
              onValueChange={value => {
                setFilter({ ...filter, CUSTOMER_CODE: value });
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
                        <SelectItem key={customer.USER_NAME} value={customer.CUSTOMER_CODE}>
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
            <Label htmlFor="from-to">Hạn lệnh *</Label>
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
