import { Button } from "@/components/common/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/common/ui/dialog";
import { CheckCircle, Loader2 } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";

import { setGlobalLoading } from "@/redux/slice/globalLoadingSlice";
import { useDispatch } from "react-redux";

export function DialogSaveBillExSuccess({
  open = false,
  dataBillAfterSave = {},
  onMakeNewExOrder
}) {
  const printRef = useRef(null);
  const dispatch = useDispatch();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onBeforePrint: () => dispatch(setGlobalLoading(true)),
    onAfterPrint: () => dispatch(setGlobalLoading(false))
  });

  return (
    <Dialog open={open}>
      <DialogContent hiddenIconClose className="max-w-[60%]">
        <DialogHeader>
          <DialogTitle className="space-y-2 text-center text-sm font-normal">
            <div className="text-xl font-bold text-green-600">Tạo lệnh thành công !</div>
            <CheckCircle className="m-auto size-16 text-green-600" />
            <div>
              Mã lệnh: <span className="font-semibold">{dataBillAfterSave?.ID}</span>
            </div>
            <div>
              Trạng thái: <span className="font-semibold">Chờ thanh toán</span>
            </div>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={onMakeNewExOrder}>
                Làm lệnh mới
              </Button>
              <Button onClick={handlePrint} variant="blue">
                In lệnh xuất kho
              </Button>
              {/* <ComponentPrintExOrder
                selectedContainer={containerList.find(
                  item => item.CONTAINER_ID === packageFilter.CONTAINER_ID
                )}
                packageFilter={packageFilter}
                ref={printRef}
                data={dataBillAfterSave}
                customerSelected={customerSelected}
              /> */}
            </div>
          </DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
