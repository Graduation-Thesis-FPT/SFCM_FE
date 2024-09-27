import { Button } from "@/components/common/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/common/ui/dialog";
import { Loader2 } from "lucide-react";
import { useCustomToast } from "@/components/common/custom-toast";
import { useEffect, useRef, useState } from "react";
import { ComponentPrintOrder } from "@/components/order/ComponentPrintOrder";
import { useReactToPrint } from "react-to-print";
import { getExportOrderForDocById } from "@/apis/export-order.api";
import moment from "moment";
import { getImportOrderForDocById } from "@/apis/import-order.api";

export function DialogDetail({ open = false, detailData = {}, onOpenChange, filter = {} }) {
  const toast = useCustomToast();
  const [loading, setLoading] = useState(false);
  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onBeforePrint: () => setLoading(true),
    onAfterPrint: () => setLoading(false)
  });

  const [dataForPrint, setDataForPrint] = useState([]);

  useEffect(() => {
    if (open) {
      if (filter.TYPE === "NK") {
        getImportOrderForDocById(detailData.order_ID)
          .then(res => {
            setDataForPrint(res.data.metadata);
          })
          .catch(err => {
            toast.error(err);
          });
      } else if (filter.TYPE === "XK") {
        getExportOrderForDocById(detailData.order_ID)
          .then(res => {
            setDataForPrint(res.data.metadata);
          })
          .catch(err => {
            toast.error(err);
          });
      }
    }
  }, [open]);

  const filterHeaderToPrint = data => {
    if (!data || !data.length) return {};
    return data[0];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent hiddenIconClose className="max-w-[70vw]">
        <DialogHeader>
          <DialogTitle>
            <div className="space-y-2 font-normal">
              <div>
                Chi tiết lệnh: <b>{detailData.order_ID}</b>
              </div>
              {detailData.pay_STATUS === "CANCELLED" && (
                <i className="text-12">
                  Lệnh đã hủy vào ngày <b>{moment(detailData.CANCEL_DATE).format("DD/MM/YYYY")}</b>{" "}
                  với lý do: <span className="font-normal">{detailData.CANCEL_REMARK}</span>
                </i>
              )}
            </div>
          </DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>
        <div>
          <ComponentPrintOrder
            statusOrder={detailData.pay_STATUS}
            className="h-[70vh] min-h-[70vh] overflow-y-auto"
            hiddenToPrint={false}
            ref={printRef}
            header={filterHeaderToPrint(dataForPrint)}
            detail={dataForPrint || []}
            type={filter.TYPE}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onOpenChange}>
            Quay lại
          </Button>
          <Button form="cancel-invoice" variant="blue" disabled={loading} onClick={handlePrint}>
            {loading && <Loader2 className="mr-2 animate-spin" />}
            In lệnh
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
