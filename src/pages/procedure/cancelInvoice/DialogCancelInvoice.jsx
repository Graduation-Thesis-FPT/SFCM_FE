import { Button } from "@/components/common/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/common/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/common/ui/form";
import { Textarea } from "@/components/common/ui/textarea";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCustomToast } from "@/components/common/custom-toast";
import { useState } from "react";
import { cancelOrder } from "@/apis/cancel-order.api";
const FormSchema = z.object({
  CANCEL_REMARK: z
    .string()
    .trim()
    .min(1, {
      message: "Vui lòng nhập lý do hủy!"
    })
    .max(100, {
      message: "Nhập tối đa 100 ký tự."
    })
});
export function DialogCancelInvoice({
  open = false,
  cancelOrderSelected = {},
  onOpenChange,
  filter = {},
  getRowData
}) {
  const toast = useCustomToast();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      CANCEL_REMARK: ""
    }
  });

  function onSubmit(data) {
    setLoading(true);
    const dataReq = {
      TYPE: filter.TYPE,
      orderID: cancelOrderSelected.order_ID,
      paymentID: cancelOrderSelected.pay_ID,
      Note: data.CANCEL_REMARK
    };
    cancelOrder(dataReq)
      .then(res => {
        getRowData();
        toast.success(res);
        form.reset();
      })
      .catch(err => {
        toast.error(err);
      })
      .finally(() => {
        setLoading(false);
        onOpenChange();
      });
  }

  return (
    <Dialog open={open}>
      <DialogContent hiddenIconClose>
        <DialogHeader>
          <DialogTitle>
            <span className="font-normal">Bạn có muốn hủy lệnh:</span>{" "}
            {cancelOrderSelected.order_ID}
          </DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>
        <Form {...form}>
          <form id="cancel-invoice" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="CANCEL_REMARK"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Lý do hủy <span className="text-red">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="Nhập lý do hủy" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button variant="outline" onClick={onOpenChange}>
            Quay lại
          </Button>

          <Button form="cancel-invoice" type="submit" variant="red" disabled={loading}>
            {loading && <Loader2 className="mr-2 animate-spin" />}
            Hủy lệnh
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
