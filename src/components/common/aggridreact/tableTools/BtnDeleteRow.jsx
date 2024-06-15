import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/common/ui/dialog";
import { Loader2, Minus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/common/ui/tooltip";
import { Button } from "@/components/common/ui/button";

export const BtnDeleteRow = forwardRef(({ isLoading, deleteRow, ...props }, ref) => {
  const [open, setOpen] = useState(false);

  const handleCloseDialog = () => {
    setOpen(false);
  };

  useImperativeHandle(ref, () => ({
    handleCloseDialog
  }));

  return (
    <>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              disabled={isLoading}
              size="tool"
              variant="none-border"
              onClick={() => setOpen(true)}
              {...props}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Minus className="h-5 w-5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Xóa dòng</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

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
            <Button variant="red" onClick={() => setOpen(false)}>
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
});
