import React from "react";
import { CustomSheet } from "../common/custom-sheet";
import { Button } from "../common/ui/button";
import { useCustomToast } from "../common/custom-toast";
import { useToggle } from "@/hooks/useToggle";
import moment from "moment";

export function EditPayment(paymentInfo) {
  const toast = useCustomToast();
  const [open, setOpen] = useToggle();
  const formatCurrency = amount => {
    if (amount == null) return "N/A";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(amount);
  };
  return (
    <>
      <Button
        variant="link"
        size="xs"
        className="text-xs text-blue-700 hover:text-blue-800"
        onClick={() => {
          setOpen(true);
        }}
      >
        Chi tiết
      </Button>
      <CustomSheet
        open={open}
        onOpenChange={() => {
          setOpen(false);
        }}
        title="Thông tin đơn hàng"
        // form={form}
      >
        <CustomSheet.Content></CustomSheet.Content>
        <CustomSheet.Footer>
          <Button
            onClick={() => {
              setOpen(false);
              //   form.reset();
            }}
            className="mr-3 h-[36px] w-[126px] text-blue-600 hover:text-blue-600"
            variant="outline"
            type="button"
          >
            Hủy
          </Button>
          <Button
            // loading={loading}
            // form="creat-user"
            type="submit"
            className="h-[36px] w-[126px]"
            variant="blue"
          >
            Tạo mới
          </Button>
        </CustomSheet.Footer>
      </CustomSheet>
    </>
  );
}
