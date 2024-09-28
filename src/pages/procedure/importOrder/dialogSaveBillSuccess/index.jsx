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
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setGlobalLoading } from "@/redux/slice/globalLoadingSlice";
import { ComponentPrintOrder } from "@/components/order/ComponentPrintOrder";
import useFetchData from "@/hooks/useRefetchData";
import { getImportOrderForDocById } from "@/apis/import-order.api";

export function DialogSaveBillSuccess({ open = false, dataBillAfterSave = {}, onMakeNewOrder }) {
  const { data: dataForPrint } = useFetchData({
    service: getImportOrderForDocById,
    params: dataBillAfterSave?.importOrder?.ID,
    dependencies: [open],
    shouldFetch: !!open
  });
  const printRef = useRef(null);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onBeforePrint: () => setLoading(true),
    onAfterPrint: () => setLoading(false)
  });

  const filterHeaderToPrint = data => {
    if (!data || !data.length) return {};
    return data[0];
  };

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
              <Button variant="outline" onClick={onMakeNewOrder} disabled={loading}>
                Quay lại
              </Button>
              <Button onClick={handlePrint} variant="blue" disabled={loading}>
                {loading && <Loader2 className="mr-2 animate-spin" />}
                In lệnh nhập kho
              </Button>
              <ComponentPrintOrder
                ref={printRef}
                header={filterHeaderToPrint(dataForPrint)}
                detail={dataForPrint || []}
                type="NK"
              />
            </div>
          </DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
