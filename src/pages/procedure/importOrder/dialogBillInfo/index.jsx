import { saveImportOrder } from "@/apis/import-order.api";
import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import { bill_info } from "@/components/common/aggridreact/dbColumns";
import { useCustomToast } from "@/components/common/custom-toast";
import { Button } from "@/components/common/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/common/ui/dialog";

import { Separator } from "@/components/common/ui/separator";
import { Textarea } from "@/components/common/ui/textarea";
import { socket } from "@/config/socket";
import { formatVnd } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
const BILL_INFO = new bill_info();

export function DialogBillInfo({
  open = false,
  onOpenChange,
  billInfoList = [],
  selectedContIdList = [],
  filterInfoSelected = {},
  onSaveImportOrderSuccess
}) {
  const gridRef = useRef(null);
  const toast = useCustomToast();
  const [isSaveImportOrder, setIsSaveImportOrder] = useState(false);
  const [noteImportOrder, setNoteImportOrder] = useState("");

  const colDefs = [
    {
      headerName: "Mã biểu cước",
      field: "ID",
      flex: 1
    },
    {
      headerName: "Tên biểu cước",
      field: "NAME",
      flex: 1
    },
    {
      headerName: "Kích thước cont (ft)",
      field: "CNTR_SIZE",
      flex: 1
    },
    {
      headerName: "Số lượng (cont)",
      field: "QTY",
      flex: 1,
      headerClass: "number-header",
      cellClass: "text-end",
      cellRenderer: params => {
        if (!params.value) {
          return "";
        }
        return Number(params.value);
      }
    },

    {
      headerName: "Đơn giá (VND)",
      field: "UNIT_PRICE",
      flex: 1,
      headerClass: "number-header",
      cellClass: "text-end",
      cellRenderer: params => formatVnd(params.value).replace("VND", "")
    },
    {
      headerName: "VAT (%)",
      field: "VAT_RATE",
      flex: 1,
      headerClass: "number-header",
      cellClass: "text-end",
      cellRenderer: params => formatVnd(params.value).replace("VND", "")
    },
    {
      headerName: "Tiền thuế (VND)",
      field: "VAT_PRICE",
      flex: 1,
      headerClass: "number-header",
      cellClass: "text-end",
      cellRenderer: params => formatVnd(params.value).replace("VND", "")
    },
    {
      headerName: "Thành tiền (VND)",
      field: "TAMOUNT",
      flex: 1,
      headerClass: "number-header",
      cellClass: "text-end",
      cellRenderer: params => formatVnd(params.value).replace("VND", "")
    }
  ];

  const handleSaveImportOrder = () => {
    setIsSaveImportOrder(true);
    const paymentInfo = {
      PRE_VAT_AMOUNT: billInfoList.reduce((a, b) => a + Number(b.AMOUNT), 0),
      VAT_AMOUNT: billInfoList.reduce((a, b) => a + Number(b.VAT_PRICE), 0),
      TOTAL_AMOUNT: billInfoList.reduce((a, b) => a + Number(b.TAMOUNT), 0)
    };
    saveImportOrder(selectedContIdList, paymentInfo, noteImportOrder)
      .then(res => {
        socket.emit("send-save-order");
        toast.success(res);
        onSaveImportOrderSuccess(res.data.metadata);
      })
      .catch(err => {
        toast.error(err);
      })
      .finally(() => {
        setIsSaveImportOrder(false);
      });
  };

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    setNoteImportOrder("");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[80%]">
        <DialogHeader>
          <DialogTitle className="text-sm font-normal">
            <div className="grid grid-cols-3 gap-x-8 gap-y-4">
              <div className="min-w-fit space-y-2">
                <p className="text-16 font-semibold">Thông tin thanh toán</p>
                <Separator />
                <div className="bold2nd grid grid-cols-3 gap-x-2 gap-y-2">
                  <p>Mã số thuế</p>
                  <p className="col-span-2">{filterInfoSelected?.TAX_CODE}</p>
                  <p>Tên đại lý</p>
                  <p className="col-span-2">{filterInfoSelected?.FULLNAME}</p>
                  <p>Địa chỉ</p>
                  <p className="col-span-2">{filterInfoSelected?.ADDRESS}</p>
                  <p>Email</p>
                  <p className="col-span-2">{filterInfoSelected?.EMAIL}</p>
                </div>
              </div>

              <div className="min-w-fit space-y-2">
                <div className="text-16 font-semibold">Tổng tiền thanh toán</div>
                <Separator />
                <div className="bold2nd grid grid-cols-2 gap-y-2">
                  <p>Tổng tiền trước thuế</p>
                  <p className="text-end">
                    {formatVnd(
                      billInfoList.reduce((a, b) => a + Number(b[BILL_INFO.AMOUNT.field]), 0)
                    )}
                  </p>
                  <p>Tổng tiền thuế</p>
                  <p className="text-end">
                    {formatVnd(
                      billInfoList?.reduce((a, b) => a + Number(b[BILL_INFO.VAT_PRICE.field]), 0)
                    )}
                  </p>
                  <p>Thành tiền</p>
                  <p className="text-end text-16 text-blue-800">
                    {formatVnd(
                      billInfoList?.reduce((a, b) => a + Number(b[BILL_INFO.TAMOUNT.field]), 0)
                    )}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-16 font-semibold">Ghi chú</div>
                <Separator />
                <div>
                  <Textarea
                    id="NOTE"
                    placeholder="Nhập ghi chú"
                    value={noteImportOrder}
                    onChange={e => setNoteImportOrder(e.target.value)}
                  />
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={handleSaveImportOrder}
                    variant="blue"
                    disabled={isSaveImportOrder}
                  >
                    {isSaveImportOrder && <Loader2 className="mr-2 animate-spin" />}
                    Xác nhận
                  </Button>
                </div>
              </div>
              <Separator className="col-span-3" />
              <span className="col-span-3">
                <div className="mb-2 font-bold">Chi tiết đơn hàng</div>
                <AgGrid
                  ref={gridRef}
                  rowSelection={"none"}
                  className="h-[200px]"
                  rowData={billInfoList || []}
                  colDefs={colDefs}
                  pagination={false}
                />
              </span>
            </div>
          </DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
