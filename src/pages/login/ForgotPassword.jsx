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
import React, { useState } from "react";

export default function ForgotPassword() {
  const [open, setOpen] = useToggle();

  return (
    <>
      <div
        onClick={() => {
          setOpen(true);
        }}
        className="cursor-pointer text-right text-sm font-light text-red-500 underline"
      >
        Quên mật khẩu?
      </div>
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
            <DialogTitle>Khôi phục mật khẩu</DialogTitle>
            <DialogDescription>Vui lòng liên hệ đến Admin để lấy lại mật khẩu!!</DialogDescription>
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
