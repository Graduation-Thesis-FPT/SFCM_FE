import { getAllCustomer } from "@/apis/customer.api";
import { getCancelInvoice } from "@/apis/order.api";
import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import { DateTimeByTextRender } from "@/components/common/aggridreact/cellRender";
import { deliver_order } from "@/components/common/aggridreact/dbColumns";
import { BtnExportExcel } from "@/components/common/aggridreact/tableTools/BtnExportExcel";
import { LayoutTool } from "@/components/common/aggridreact/tableTools/LayoutTool";
import { useCustomToast } from "@/components/common/custom-toast";
import { DatePickerWithRangeInForm } from "@/components/common/date-range-picker";
import { Section } from "@/components/common/section";
import { SelectSearch } from "@/components/common/select-search";
import { Button } from "@/components/common/ui/button";
import { Label } from "@/components/common/ui/label";
import useFetchData from "@/hooks/useRefetchData";
import { formatVnd } from "@/lib/utils";
import { setGlobalLoading } from "@/redux/slice/globalLoadingSlice";
import { Dialog } from "@radix-ui/react-dialog";
import { addDays } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { DialogCancelInvoice } from "./DialogCancelInvoice";

const DELIVER_ORDER = new deliver_order();

export function CancelInvoice() {
  const { data: customerList, loading: loadingCustomerList } = useFetchData({
    service: getAllCustomer
  });
  const toast = useCustomToast();
  const gridRef = useRef(null);
  const dispatch = useDispatch();
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
      headerName: DELIVER_ORDER.DE_ORDER_NO.headerName,
      field: DELIVER_ORDER.DE_ORDER_NO.field,
      flex: 1,
      filter: true
    },
    {
      headerName: DELIVER_ORDER.INV_ID.headerName,
      field: DELIVER_ORDER.INV_ID.field,
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
      headerName: "INV_DATE",
      field: "INV_DATE",
      flex: 1,
      cellRenderer: DateTimeByTextRender
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
      headerName: "Trạng thái thanh toán",
      field: "PAYMENT_STATUS",
      flex: 1
    },
    {
      field: "#",
      headerName: "",
      minWidth: 120,
      flex: 0.5,
      cellStyle: { alignContent: "center", textAlign: "center" },
      cellRenderer: params => {
        return (
          <Button
            variant="link"
            size="xs"
            onClick={() => {
              setOpenDialog(true);
              setCancelInvoiceData(params.data);
            }}
            className="text-xs text-red-700 hover:text-red-700/80"
          >
            Hủy lệnh
          </Button>
        );
      }
    }
  ];

  const [openDialog, setOpenDialog] = useState(false);
  const [rowData, setRowData] = useState([]);

  const [cancelInvoiceData, setCancelInvoiceData] = useState({});

  const getRowData = () => {
    getCancelInvoice(filter)
      .then(res => {
        setRowData(res.data.metadata);
      })
      .catch(err => {
        toast.error(err);
      });
  };

  const initFilter = {
    from: addDays(new Date(), -30),
    to: addDays(new Date(), 30),
    CUSTOMER_CODE: "",
    PAYMENT_STATUS: "all"
  };

  const [filter, setFilter] = useState(initFilter);

  useEffect(() => {
    dispatch(setGlobalLoading(true));
    getCancelInvoice(filter)
      .then(res => {
        setRowData(res.data.metadata);
      })
      .catch(err => {
        toast.error(err);
      })
      .finally(() => {
        dispatch(setGlobalLoading(false));
      });
  }, [filter]);

  return (
    <Section>
      <Section.Header className="grid grid-cols-5 items-end gap-3">
        <div>
          <Label htmlFor="from-to">Ngày làm lệnh *</Label>
          <DatePickerWithRangeInForm
            className="w-full"
            id="from-to"
            date={{ from: filter.from, to: filter.to }}
            onSelected={value => {
              setFilter({ ...filter, from: value?.from, to: value?.to });
            }}
          />
        </div>
        <div>
          <Label htmlFor="CUSTOMER_CODE">Khách hàng</Label>
          <SelectSearch
            id="CUSTOMER_CODE"
            className="w-full"
            labelSelect={loadingCustomerList ? "Đang tải dữ liệu..." : "Chọn khách hàng"}
            value={filter.CUSTOMER_CODE}
            data={customerList?.map(item => {
              return {
                value: item.CUSTOMER_CODE,
                label: `${item.CUSTOMER_CODE + " - " + item.CUSTOMER_NAME}`
              };
            })}
            onSelect={value => {
              setFilter({ ...filter, CUSTOMER_CODE: value });
            }}
          />
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
      <DialogCancelInvoice
        getRowData={getRowData}
        open={openDialog}
        onOpenChange={() => {
          setOpenDialog(false);
        }}
        cancelInvoiceData={cancelInvoiceData}
      />
    </Section>
  );
}
