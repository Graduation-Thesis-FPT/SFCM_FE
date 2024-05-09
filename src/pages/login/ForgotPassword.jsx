import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { CircleCheckBig, Loader2, Plus } from "lucide-react";

const formSchema = z.object({
  USER_NAME: z.string().min(1, "Vui lòng nhập tài khoản đăng nhập!")
});

export default function ForgotPassword() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { USER_NAME: "" }
  });

  function onSubmit(values) {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setMessage(
        `Yêu cầu của bạn đã được gửi đến Admin! Vui long kiểm tra email "abc***@gmail.com" để nhận mật khẩu mới.`
      );
    }, 3000);
  }
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Khôi phục mật khẩu</DialogTitle>
            <DialogDescription>Yêu cầu của bạn sẽ được gửi đến Admin</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="USER_NAME"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel className="text-base font-bold">Tài khoản</FormLabel> */}
                    <FormControl>
                      <Input
                        className="focus-visible:ring-offset-0"
                        type="text"
                        placeholder="Nhập tài khoản đăng nhập"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage style={{ fontSize: "12px" }} />
                  </FormItem>
                )}
              />
              <DialogFooter>
                {message ? (
                  <p className="text-sm text-green-500">{message}</p>
                ) : (
                  <Button type="submit" variant="blue" disabled={isLoading}>
                    Gửi yêu cầu
                  </Button>
                )}
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
