import { Button } from "@/components/common/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/common/ui/dialog";
import { CheckCircle } from "lucide-react";
import { ComponentPrintInOrder } from "./ComponentPrintInOrder";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { setGlobalLoading } from "@/redux/slice/globalLoadingSlice";

export function DialogSaveBillSuccess({
  open = false,
  dataBillAfterSave = {},
  billInfoList = [],
  filterInfoSelected = {},
  onMakeNewOrder
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
      <DialogContent hiddenIconClose className="max-w-[50%]">
        <DialogHeader>
          <DialogTitle className="space-y-2 text-center text-sm font-normal">
            <div className="text-xl font-bold text-green-600">Tạo lệnh nhập thành công!</div>
            <CheckCircle className="m-auto size-16 text-green-600" />
            <div>
              Mã lệnh: <span className="font-semibold">{dataBillAfterSave?.importOrder?.ID}</span>
            </div>
            <div>
              Trạng thái: <span className="font-semibold">Chờ thanh toán</span>
            </div>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={onMakeNewOrder}>
                Làm lệnh mới
              </Button>
              <Button onClick={handlePrint} variant="blue">
                In lệnh nhập kho
              </Button>
              <ComponentPrintInOrder
                ref={printRef}
                filterInfoSelected={filterInfoSelected}
                dataBillAfterSave={dataBillAfterSave}
                billInfoList={billInfoList}
              />
            </div>
          </DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
