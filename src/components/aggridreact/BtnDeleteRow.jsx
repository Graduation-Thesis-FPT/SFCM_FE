import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
export function BtnDeleteRow({ tableRef, deleteRow, ...props }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant='red' onClick={() => setOpen(true)} {...props}>
        Xóa dòng
      </Button>
      <Dialog
        open={open}
        onOpenChange={() => {
          setOpen(false);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bạn có chắc chắn muốn xóa dữ liệu này không?</DialogTitle>
            <DialogDescription>Hành động này không thể hoàn tác.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='red' onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                deleteRow();
              }}
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
