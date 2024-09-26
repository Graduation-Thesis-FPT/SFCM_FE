import { saveExportOrder } from "@/apis/export-order.api";
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
import moment from "moment";
import { useEffect, useRef, useState } from "react";

const BILL_INFO = new bill_info();

export function DialogBillInfoEx({
  open = false,
  onOpenChange,
  billInfoEx = [],
  customerSelected = {},
  onSaveExOrderSuccess
}) {
  const gridRef = useRef(null);
  const toast = useCustomToast();
  const [isSaveExOrder, setIsSaveExOrder] = useState(false);
  const [noteExportOrder, setNoteExportOrder] = useState("");

  const colDefs = [
    {
      headerName: "Số House Bill",
      field: "HOUSE_BILL",
      flex: 1
    },
    {
      headerName: "Loại hàng",
      field: "PACKAGE_TYPE_ID",
      flex: 1
    },
    {
      headerName: "Ngày nhập kho",
      field: "TIME_IN",
      flex: 1,
      cellDataType: "date"
    },
    {
      headerName: "Tổng số khối (m³)",
      field: "CBM",
      flex: 1,
      headerClass: "number-header",
      cellClass: "text-end"
    },
    {
      headerName: "Chi tiết biểu cước",
      field: "PACKAGE_TARIFF_DESCRIPTION",
      flex: 1
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
      field: "VAT_AMOUNT",
      flex: 1,
      headerClass: "number-header",
      cellClass: "text-end",
      cellRenderer: params => formatVnd(params.value).replace("VND", "")
    },
    {
      headerName: "Thành tiền (VND)",
      field: "PRE_VAT_AMOUNT",
      flex: 1,
      headerClass: "number-header",
      cellClass: "text-end",
      cellRenderer: params => formatVnd(params.value).replace("VND", "")
    },
    {
      headerName: "Tổng tiền (VND)",
      field: "TOTAL_AMOUNT",
      flex: 1,
      headerClass: "number-header",
      cellClass: "text-end",
      cellRenderer: params => formatVnd(params.value).replace("VND", "")
    }
  ];

  const handleSaveExOrder = () => {
    setIsSaveExOrder(true);
    const reqData = { ...billInfoEx, NOTE: noteExportOrder };
    saveExportOrder(reqData)
      .then(res => {
        socket.emit("saveExOrderSuccess");
        toast.success(res);
        onSaveExOrderSuccess(res.data.metadata);
      })
      .catch(err => {
        toast.error(err);
      })
      .finally(() => {
        setIsSaveExOrder(false);
      });
  };

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    setNoteExportOrder("");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[80%]">
        <DialogHeader>
          <DialogTitle className="text-sm font-normal">
            <div className="grid grid-cols-3 gap-x-8 gap-y-4">
              <div className="space-y-2">
                <p className="text-16 font-semibold">Thông tin thanh toán</p>
                <Separator />
                <div className="bold2nd grid grid-cols-3 gap-x-2 gap-y-2">
                  <p>Mã số thuế</p>
                  <p className="col-span-2">{customerSelected?.TAX_CODE}</p>
                  <p>Tên chủ hàng</p>
                  <p className="col-span-2">{customerSelected.FULLNAME}</p>
                  <p>Địa chỉ</p>
                  <p className="col-span-2">{customerSelected?.ADDRESS}</p>
                  <p>Email</p>
                  <p className="col-span-2">{customerSelected?.EMAIL}</p>
                  <p>Ngày lấy hàng</p>
                  <p className="col-span-2">
                    {billInfoEx?.PICKUP_DATE
                      ? moment(billInfoEx?.PICKUP_DATE).format("DD/MM/YYYY")
                      : ""}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-16 font-semibold">Tổng tiền thanh toán</p>
                <Separator />
                <div className="bold2nd grid grid-cols-2 gap-y-2">
                  <p>{BILL_INFO.AMOUNT.headerName}</p>
                  <p className="text-end">{formatVnd(billInfoEx?.PRE_VAT_AMOUNT)}</p>
                  <p>{BILL_INFO.VAT_PRICE.headerName}</p>
                  <p className="text-end">{formatVnd(billInfoEx?.VAT_AMOUNT)}</p>
                  <p>{BILL_INFO.TAMOUNT.headerName}</p>
                  <p className="text-end">{formatVnd(billInfoEx?.TOTAL_AMOUNT)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-16 font-semibold">Ghi chú</div>
                <Separator />
                <div>
                  <Textarea
                    id="NOTE"
                    placeholder="Nhập ghi chú"
                    value={noteExportOrder}
                    onChange={e => setNoteExportOrder(e.target.value)}
                  />
                </div>

                <div className="flex justify-center">
                  <Button onClick={handleSaveExOrder} variant="blue" disabled={isSaveExOrder}>
                    {isSaveExOrder && <Loader2 className="mr-2 animate-spin" />}
                    Xác nhận thanh toán
                  </Button>
                </div>
              </div>
              <Separator className="col-span-3 " />
              <div className="col-span-3">
                <div className="mb-2 font-bold">Chi tiết đơn hàng</div>
                <AgGrid
                  ref={gridRef}
                  rowSelection={"none"}
                  className="h-[300px]"
                  rowData={billInfoEx?.ORDER_DETAILS || []}
                  colDefs={colDefs}
                  pagination={false}
                />
              </div>
            </div>
          </DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
