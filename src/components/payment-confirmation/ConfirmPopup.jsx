import { updatePaymentStatus } from "@/apis/payment.api";
import { Button } from "@/components/common/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/common/ui/dialog";
import { useToggle } from "@/hooks/useToggle";
import { formatVnd } from "@/lib/utils";
import { setGlobalLoading } from "@/redux/slice/globalLoadingSlice";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useCustomToast } from "../common/custom-toast";
import { socket } from "@/config/socket";

export default function ConfirmPopup({ paymentInfo, setSheetOpen, revalidatePayments }) {
  const [open, setOpen] = useToggle();
  const dispatch = useDispatch();
  const toast = useCustomToast();

  const handleConfirmPayment = async () => {
    dispatch(setGlobalLoading(true));
    updatePaymentStatus({ paymentInfo })
      .then(res => {
        socket.emit("send-package-export");
        dispatch(setGlobalLoading(false));
        revalidatePayments();
        toast.success(res);
        setOpen(false);
        setSheetOpen(false);
      })
      .catch(err => {
        dispatch(setGlobalLoading(false));
        toast.error(err);
      });
  };

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <Button
        className="h-[36px] w-fit"
        variant="blue"
        onClick={() => {
          setOpen(true);
        }}
      >
        Xác nhận
      </Button>

      <Dialog
        open={open}
        onOpenChange={() => {
          setOpen(false);
        }}
      >
        <DialogContent
          onOpenAutoFocus={e => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-blue-600">Xác nhận thanh toán</DialogTitle>
            <div className="text-sm text-black">
              <p>
                Bạn xác nhận khách hàng <b>{paymentInfo?.ORDER?.USER?.FULLNAME ?? "N/A"}</b>
              </p>
              <p>
                đã thanh toán số tiền là{" "}
                <b>{formatVnd(paymentInfo?.PAYMENT?.TOTAL_AMOUNT ?? 1)} </b>
              </p>

              <p>
                cho lệnh có mã <b>{paymentInfo?.ORDER?.ID ?? "N/A"}</b>
              </p>
            </div>
            <DialogDescription className="hidden" />
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setOpen(false);
              }}
              variant="outline"
            >
              Đóng
            </Button>
            <Button className="h-[36px] w-fit" variant="blue" onClick={handleConfirmPayment}>
              Xác nhận thanh toán
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
