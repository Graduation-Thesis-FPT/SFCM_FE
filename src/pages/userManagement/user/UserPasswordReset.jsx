import { resetPasswordById } from "@/apis/user.api";
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
import React from "react";

export const UserPasswordReset = ({ detail = {}, openDialog, setOpenDialog }) => {
  const toast = useCustomToast();
  const handleResetPassword = () => {
    const DEFAULT_PASSWORD = import.meta.env.VITE_DEFAULT_PASSWORD;
    if (!DEFAULT_PASSWORD || !detail.ROWGUID) {
      toast.error("Lỗi hệ thống, vui lòng thử lại sau!");
      return;
    }
    resetPasswordById({ id: detail.ROWGUID, data: { DEFAULT_PASSWORD } })
      .then(res => {
        toast.success(res);
        setOpenDialog(false);
      })
      .catch(err => {
        toast.error(err);
      });
  };
  return (
    <Dialog
      open={openDialog}
      onOpenChange={() => {
        setOpenDialog(false);
      }}
    >
      <DialogContent
        onOpenAutoFocus={e => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Khôi phục lại mật khẩu</DialogTitle>
          <DialogDescription>
            Mật khẩu mặc định sẽ được cấp lại cho người dùng. Bạn có chắc chắn muốn thực hiện
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => {
              setOpenDialog(false);
            }}
            type="button"
            variant="outline"
          >
            Hủy
          </Button>
          <Button
            onClick={() => {
              handleResetPassword();
            }}
            type="button"
            variant="blue"
          >
            Khôi phục
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};