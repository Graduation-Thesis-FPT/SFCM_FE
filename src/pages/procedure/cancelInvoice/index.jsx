import { getAllCustomer } from "@/apis/customer.api";
import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import { StatusOrderPaymentRender } from "@/components/common/aggridreact/cellRender";
import { BtnExportExcel } from "@/components/common/aggridreact/tableTools/BtnExportExcel";
import { LayoutTool } from "@/components/common/aggridreact/tableTools/LayoutTool";
import { useCustomToast } from "@/components/common/custom-toast";
import { DatePickerWithRangeInForm } from "@/components/common/date-range-picker";
import { Section } from "@/components/common/section";
import { SelectSearch } from "@/components/common/select-search";
import { Button } from "@/components/common/ui/button";
import { Label } from "@/components/common/ui/label";
import useFetchData from "@/hooks/useRefetchData";
import { setGlobalLoading } from "@/redux/slice/globalLoadingSlice";
import { addDays } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { DialogCancelInvoice } from "./DialogCancelInvoice";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/common/ui/select";
import { Input } from "@/components/common/ui/input";
import { loadCancelOrder } from "@/apis/cancel-order.api";
import { DialogDetail } from "./DialogDetail";
import { Badge } from "@/components/common/ui/badge";
import { ArrowRightToLine } from "lucide-react";

const initFilter = {
  from: addDays(new Date(), -30),
  to: addDays(new Date(), 30),
  TYPE: "NK",
  ORDER_ID: "",
  CUSTOMER_ID: ""
};

export function CancelInvoice() {
  const toast = useCustomToast();
  const gridRef = useRef(null);
  const dispatch = useDispatch();
  const { data: customerList, loading: loadingCustomerList } = useFetchData({
    service: getAllCustomer
  });
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
      headerName: "Mã lệnh",
      field: "order_ID",
      flex: 1,
      filter: true
    },
    {
      headerName: "Loại lệnh",
      field: "TYPE",
      minWidth: 110,
      maxWidth: 110,
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
      headerName: "Tên khách hàng",
      field: "FULLNAME",
      flex: 1,
      filter: true
    },
    {
      headerName: "Ghi chú",
      field: "order_NOTE",
      flex: 1,
      filter: true
    },
    {
      headerName: "Ngày làm lệnh",
      field: "CREATED_AT",
      flex: 1,
      filter: true,
      cellDataType: "date"
    },
    {
      headerName: "Trạng thái thanh toán",
      field: "pay_STATUS",
      minWidth: 180,
      maxWidth: 180,
      cellRenderer: StatusOrderPaymentRender
    },
    {
      field: "#",
      headerName: "",
      flex: 1,
      cellStyle: { alignContent: "center", textAlign: "center" },
      cellRenderer: params => {
        if (params.data.pay_STATUS === "PAID" || params.data.pay_STATUS === "CANCELLED") {
          return (
            <Button
              variant="link"
              size="xs"
              onClick={() => {
                setOpenDialogDetail(true);
                setCancelOrderSelected(params.data);
              }}
              className="text-xs text-blue-700 hover:text-blue-700/80"
            >
              Chi tiết
            </Button>
          );
        }
        return (
          <div>
            <Button
              variant="link"
              size="xs"
              onClick={() => {
                setOpenDialog(true);
                setCancelOrderSelected(params.data);
              }}
              className="text-xs text-red-700 hover:text-red-700/80"
            >
              Hủy lệnh
            </Button>
            <Button
              variant="link"
              size="xs"
              onClick={() => {
                setOpenDialogDetail(true);
                setCancelOrderSelected(params.data);
              }}
              className="text-xs text-blue-700 hover:text-blue-700/80"
            >
              Chi tiết
            </Button>
          </div>
        );
      }
    }
  ];

  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogDetail, setOpenDialogDetail] = useState(false);
  const [rowData, setRowData] = useState([]);

  const [filter, setFilter] = useState(initFilter);

  const [cancelOrderSelected, setCancelOrderSelected] = useState({});

  const getRowData = () => {
    loadCancelOrder(filter)
      .then(res => {
        setRowData(res.data.metadata);
      })
      .catch(err => {
        toast.error(err);
      });
  };

  useEffect(() => {
    dispatch(setGlobalLoading(true));
    loadCancelOrder(filter)
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
      <Section.Header className="flex items-end gap-3">
        <div>
          <Label htmlFor="ORDER_ID">Mã đơn hàng</Label>
          <Input
            className="hover:cursor-pointer"
            id="ORDER_ID"
            placeholder="Nhập mã đơn hàng"
            onBlur={e => {
              setFilter({ ...filter, ORDER_ID: e.target.value });
            }}
          />
        </div>

        <div>
          <Label htmlFor="CUSTOMER_ID">Khách hàng</Label>
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
          <Label htmlFor="TYPE">Loại lệnh *</Label>
          <Select
            id="TYPE"
            value={filter.TYPE}
            onValueChange={value => {
              setFilter({ ...filter, TYPE: value });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn loại lệnh" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="NK">Lệnh nhập</SelectItem>
                <SelectItem value="XK">Lệnh xuất</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
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
      </Section.Header>
      <Section.Content>
        <span className="flex items-end justify-between">
          <span className="text-lg font-bold">Danh sách các lệnh</span>
          <LayoutTool>
            <BtnExportExcel gridRef={gridRef} />
          </LayoutTool>
        </span>

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
            }}
          />
        </Section.Table>
      </Section.Content>
      <DialogCancelInvoice
        filter={filter}
        getRowData={getRowData}
        open={openDialog}
        onOpenChange={() => {
          setOpenDialog(false);
        }}
        cancelOrderSelected={cancelOrderSelected}
      />

      <DialogDetail
        filter={filter}
        getRowData={getRowData}
        open={openDialogDetail}
        onOpenChange={() => {
          setOpenDialogDetail(false);
        }}
        detailData={cancelOrderSelected}
      />
    </Section>
  );
}
