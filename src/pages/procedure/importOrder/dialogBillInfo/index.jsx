import { saveInOrder } from "@/apis/order.api";
import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import { bill_info, bs_customer } from "@/components/common/aggridreact/dbColumns";
import { useCustomToast } from "@/components/common/custom-toast";
import { Button } from "@/components/common/ui/button";
import { Checkbox } from "@/components/common/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/common/ui/dialog";
import { Separator } from "@/components/common/ui/separator";
import { useSocket } from "@/hooks/useSocket";
import { formatVnd, removeLastAsterisk } from "@/lib/utils";
import { setGlobalLoading } from "@/redux/slice/globalLoadingSlice";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";

export function DialogBillInfo({
  open = false,
  onOpenChange,
  onSaveInOrderSuccess,
  billInfoList = [],
  selectedCustomer = {},
  EXP_DATE = "",
  rowData = []
}) {
  const dispatch = useDispatch();
  const gridRef = useRef(null);
  const [thuNgay, setThuNgay] = useState(true);
  const BILL_INFO = new bill_info();
  const BS_CUSTOMER = new bs_customer();
  const toast = useCustomToast();
  const socket = useSocket();

  const colDefs = [
    {
      headerName: BILL_INFO.METHOD_CODE.headerName,
      field: BILL_INFO.METHOD_CODE.field,
      flex: 1
    },
    {
      headerName: BILL_INFO.ITEM_TYPE_CODE.headerName,
      field: BILL_INFO.ITEM_TYPE_CODE.field,
      flex: 1
    },
    {
      headerName: BILL_INFO.QTY.headerName,
      field: BILL_INFO.QTY.field,
      flex: 1
    },
    {
      headerName: BILL_INFO.UNIT_RATE.headerName,
      field: BILL_INFO.UNIT_RATE.field,
      flex: 1,
      valueFormatter: params => {
        return Number(params.value).toLocaleString("it-IT", {
          currency: "VND"
        });
      }
    },

    {
      headerName: BILL_INFO.AMT_CBM.headerName,
      field: BILL_INFO.AMT_CBM.field,
      flex: 1
    },
    {
      headerName: BILL_INFO.VAT.headerName,
      field: BILL_INFO.VAT.field,
      flex: 1
    },
    {
      headerName: BILL_INFO.VAT_PRICE.headerName,
      field: BILL_INFO.VAT_PRICE.field,
      flex: 1,
      valueFormatter: params => {
        return Number(params.value).toLocaleString("it-IT", {
          currency: "VND"
        });
      }
    },

    {
      headerName: BILL_INFO.AMOUNT.headerName,
      field: BILL_INFO.AMOUNT.field,
      flex: 1,
      valueFormatter: params => {
        return Number(params.value).toLocaleString("it-IT", {
          currency: "VND"
        });
      }
    },

    {
      headerName: BILL_INFO.TRF_DESC.headerName,
      field: BILL_INFO.TRF_DESC.field,
      flex: 1
    }
  ];

  const handleSaveInOrder = () => {
    dispatch(setGlobalLoading(true));
    let temp = [...rowData];
    const reqData = temp.map(item => {
      return { ...item, EXP_DATE: EXP_DATE, CUSTOMER_CODE: selectedCustomer.CUSTOMER_CODE };
    });
    saveInOrder(reqData)
      .then(res => {
        onOpenChange();
        socket.emit("saveInOrderSuccess");
        onSaveInOrderSuccess(res.data.metadata);
        toast.success(res);
      })
      .catch(err => {
        toast.error(err);
      })
      .finally(() => {
        dispatch(setGlobalLoading(false));
      });
  };

  if (!selectedCustomer.CUSTOMER_NAME || !billInfoList.length) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[80%]">
        <DialogHeader>
          <DialogTitle className="text-sm font-normal">
            <span className="grid grid-cols-3 gap-x-8 gap-y-8">
              <span className="space-y-2">
                <div className="text-16 font-semibold">Thông tin thanh toán</div>
                <Separator />
                <span className="bold2nd grid grid-cols-2 gap-y-2">
                  <div>{removeLastAsterisk(BS_CUSTOMER.TAX_CODE.headerName)}</div>
                  <div>{selectedCustomer[BS_CUSTOMER.TAX_CODE.field]}</div>
                  <div>{removeLastAsterisk(BS_CUSTOMER.CUSTOMER_NAME.headerName)}</div>
                  <div>{selectedCustomer[BS_CUSTOMER.CUSTOMER_NAME.field]}</div>
                  <div>{BS_CUSTOMER.ADDRESS.headerName}</div>
                  <div>{selectedCustomer[BS_CUSTOMER.ADDRESS.field]}</div>
                  <div>{BS_CUSTOMER.EMAIL.headerName}</div>
                  <div>{selectedCustomer[BS_CUSTOMER.EMAIL.field]}</div>
                </span>
              </span>

              <span className="space-y-2">
                <div className="text-16 font-semibold">Tổng tiền thanh toán</div>
                <Separator />
                <div className="bold2nd grid grid-cols-2 gap-y-2">
                  <div>{BILL_INFO.AMOUNT.headerName}</div>
                  <div>{formatVnd(billInfoList[0][BILL_INFO.AMOUNT.field])}</div>
                  <div>{BILL_INFO.VAT_PRICE.headerName}</div>
                  <div>{formatVnd(billInfoList[0][BILL_INFO.VAT_PRICE.field])}</div>
                  <div>{BILL_INFO.TAMOUNT.headerName}</div>
                  <div>{formatVnd(billInfoList[0][BILL_INFO.TAMOUNT.field])}</div>
                </div>
              </span>

              <span className="space-y-2">
                <div className="text-16 font-semibold">Hình thức thanh toán</div>
                <Separator />
                <div className="">
                  <span className="flex items-center space-x-2">
                    <Checkbox
                      className="self-center justify-self-center border-blue-600 data-[state=checked]:bg-blue-600"
                      checked={thuNgay}
                      onCheckedChange={setThuNgay}
                    />
                    <div className="font-semibold">THU NGAY</div>
                  </span>
                </div>
                <div className="flex justify-center">
                  <Button onClick={handleSaveInOrder} variant="blue">
                    Xác nhận thanh toán
                  </Button>
                </div>
              </span>

              <span className="col-span-3">
                <AgGrid
                  ref={gridRef}
                  rowSelection={"none"}
                  className="h-[200px]"
                  rowData={billInfoList || []}
                  colDefs={colDefs}
                  pagination={false}
                />
              </span>
            </span>
          </DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
