import { Button } from "@/components/common/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/common/ui/dialog";

import { CheckCircle, CheckCircle2 } from "lucide-react";
import moment from "moment";

export function DialogSaveBillSuccess({ open = false, onOpenChange, data = {}, onMakeNewOrder }) {
  if (!data.neworder || !data.neworderDtl) {
    return null;
  }
  return (
    <Dialog open={open}>
      <DialogContent hiddenIconClose className="max-w-[60%]">
        <DialogHeader>
          <DialogTitle className="space-y-2 text-center text-sm font-normal">
            <div className="text-xl font-bold text-green-600">Tạo lệnh thành công !</div>
            <CheckCircle className="m-auto size-16 text-green-600" />
            <div>
              Mã lệnh: <span className="font-semibold">{data.neworder.DE_ORDER_NO}</span>
            </div>
            <div>
              Mã hóa đơn: <span className="font-semibold">{data.neworder.INV_ID}</span>
            </div>
            <div>
              Ngày hết hạn lệnh:
              <span className="font-semibold">
                {" "}
                {moment(data.neworder.EXP_DATE).format("DD/MM/Y HH:mm")}
              </span>
            </div>
            <div className="space-x-4">
              <Button variant="outline" onClick={onMakeNewOrder}>
                Làm lệnh mới
              </Button>
              <Button variant="blue">In lệnh</Button>
              <Button variant="green">In hóa đơn</Button>
            </div>
          </DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
