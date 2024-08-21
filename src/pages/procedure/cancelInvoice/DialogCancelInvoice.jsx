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
import { CheckCircle, Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cancelInvoice } from "@/apis/order.api";
import { useCustomToast } from "@/components/common/custom-toast";
import { useState } from "react";
const FormSchema = z.object({
  reason: z
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
  cancelInvoiceData = {},
  onOpenChange,
  getRowData
}) {
  const toast = useCustomToast();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      reason: ""
    }
  });

  function onSubmit(data) {
    setLoading(true);
    const dataReq = {
      fkey: cancelInvoiceData.DE_ORDER_NO,
      reason: data.reason,
      cancelDate: new Date(),
      invNo: cancelInvoiceData.INV_ID
    };
    cancelInvoice(dataReq)
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
            {cancelInvoiceData.DE_ORDER_NO}
          </DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>
        <Form {...form}>
          <form id="cancel-invoice" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="reason"
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

          <Button form="cancel-invoice" type="submit" variant="red" onClick={() => {}}>
            {loading && <Loader2 className="mr-2 animate-spin" />}
            Hủy lệnh
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
