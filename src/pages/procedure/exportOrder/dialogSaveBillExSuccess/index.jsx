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
import { getExportOrderForDocById } from "@/apis/export-order.api";
import useFetchData from "@/hooks/useRefetchData";
import { ComponentPrintOrder } from "@/components/order/ComponentPrintOrder";

export function DialogSaveBillExSuccess({
  open = false,
  dataBillAfterSave = {},
  onMakeNewExOrder
}) {
  const { data: dataForPrint } = useFetchData({
    service: getExportOrderForDocById,
    params: [dataBillAfterSave?.ID],
    dependencies: [open],
    shouldFetch: !!open
  });
  const [loading, setLoading] = useState(false);
  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onBeforePrint: () => setLoading(true),
    onAfterPrint: () => setLoading(false)
  });

  const temp = data => {
    if (!data || !data.length) return {};
    return data[0];
  };

  return (
    <>
      <ComponentPrintOrder
        ref={printRef}
        header={temp(dataForPrint)}
        detail={dataForPrint || []}
        type="XK"
      />
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
                <Button variant="outline" onClick={onMakeNewExOrder} disabled={loading}>
                  Làm lệnh mới
                </Button>
                <Button onClick={handlePrint} variant="blue" disabled={loading}>
                  {loading && <Loader2 className="mr-2 animate-spin" />}
                  In lệnh xuất kho
                </Button>
              </div>
            </DialogTitle>
            <DialogDescription className="hidden" />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
