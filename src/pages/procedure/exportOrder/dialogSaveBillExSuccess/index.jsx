import { Button } from "@/components/common/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/common/ui/dialog";
import { CheckCircle, Loader2 } from "lucide-react";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import { useRef, useState } from "react";
import { viewInvoice } from "@/apis/order.api";
import { useCustomToast } from "@/components/common/custom-toast";
import { ComponentPrintExOrder } from "./ComponentPrintExOrder";
import { setGlobalLoading } from "@/redux/slice/globalLoadingSlice";
import { useDispatch } from "react-redux";

export function DialogSaveBillExSuccess({
  open = false,
  dataBillAfterSave = {},
  selectedCustomer = {},
  packageFilter = {},
  containerList = [],
  onMakeNewExOrder
}) {
  const toast = useCustomToast();
  const printRef = useRef(null);
  const [isPrintInvoice, setIsPrintInvoice] = useState(false);
  const dispatch = useDispatch();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onBeforePrint: () => dispatch(setGlobalLoading(true)),
    onAfterPrint: () => dispatch(setGlobalLoading(false))
  });

  const handleInvoicePublish = () => {
    setIsPrintInvoice(true);
    viewInvoice(dataBillAfterSave.neworder.DE_ORDER_NO)
      .then(res => {
        if (!res.data.metadata.success) {
          throw new Error(res.data.metadata.error);
        }
        let base64Data = res.data.metadata.content.data;
        const blob = new Blob([new Uint8Array(base64Data).buffer], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank");
      })
      .catch(err => {
        if (err?.message?.includes("Cannot")) {
          return toast.error("Không thể xem hóa đơn. Vui lòng thử lại sau!");
        }
        toast.error(err);
      })
      .finally(() => {
        setIsPrintInvoice(false);
      });
  };

  if (!dataBillAfterSave.neworder || !dataBillAfterSave.neworderDtl) {
    return <></>;
  }
  return (
    <Dialog open={open}>
      <DialogContent hiddenIconClose className="max-w-[60%]">
        <DialogHeader>
          <DialogTitle className="space-y-2 text-center text-sm font-normal">
            <div className="text-xl font-bold text-green-600">Tạo lệnh thành công !</div>
            <CheckCircle className="m-auto size-16 text-green-600" />
            <div>
              Mã lệnh:{" "}
              <span className="font-semibold">{dataBillAfterSave.neworder.DE_ORDER_NO}</span>
            </div>
            <div>
              Mã hóa đơn: <span className="font-semibold">{dataBillAfterSave.neworder.INV_ID}</span>
            </div>
            <div>
              Ngày hết hạn lệnh:
              <span className="font-semibold">
                {" "}
                {moment(dataBillAfterSave.neworder.EXP_DATE).format("DD/MM/Y HH:mm")}
              </span>
            </div>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={onMakeNewExOrder}>
                Làm lệnh mới
              </Button>
              <Button onClick={handlePrint} variant="blue">
                In lệnh
              </Button>
              <Button onClick={handleInvoicePublish} variant="green" disabled={isPrintInvoice}>
                {isPrintInvoice && <Loader2 className="mr-2 animate-spin" />}
                Hóa đơn điện tử
              </Button>
              <ComponentPrintExOrder
                selectedContainer={containerList.find(
                  item => item.CONTAINER_ID === packageFilter.CONTAINER_ID
                )}
                packageFilter={packageFilter}
                ref={printRef}
                data={dataBillAfterSave}
                selectedCustomer={selectedCustomer}
              />
            </div>
          </DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
