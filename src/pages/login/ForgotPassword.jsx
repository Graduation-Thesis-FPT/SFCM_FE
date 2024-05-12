import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  USER_NAME: z.string().min(1, "Vui lòng nhập tài khoản đăng nhập!")
});

export default function ForgotPassword() {
  const [open, setOpen] = useState(false);
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
      <Dialog>
        <DialogTrigger asChild>
          <div
            onClick={() => {
              setOpen(true);
            }}
            className="cursor-pointer text-right text-sm font-light text-red-500 underline"
          >
            Quên mật khẩu?
          </div>
        </DialogTrigger>
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
            <DialogClose>
              <Button variant="outline">Đóng</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
