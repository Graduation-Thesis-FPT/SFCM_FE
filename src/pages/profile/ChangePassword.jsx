import { changePassword } from "@/apis/access.api";
import { useCustomToast } from "@/components/common/custom-toast";
import { Button } from "@/components/common/ui/button";
import {
  Dialog,
  DialogContent,
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
import { Password } from "@/components/common/ui/password";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/common/ui/tooltip";
import { useToggle } from "@/hooks/useToggle";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function ChangePassword() {
  const toast = useCustomToast();
  const formSchema = z
    .object({
      CURRENT_PASSWORD: z.string().min(5, "Vui lòng nhập mật khẩu!"),
      PASSWORD: z.string().min(5, "Vui lòng nhập mật khẩu!"),
      CONFIRM_PASSWORD: z.string().min(5, "Vui lòng nhập lại mật khẩu tối thiểu 5 ký tự!")
    })
    .refine(data => data.PASSWORD === data.CONFIRM_PASSWORD, {
      message: "Mật khẩu xác nhận không khớp!",
      path: ["CONFIRM_PASSWORD"]
    });
  const [openDialog, setOpenDialog] = useToggle();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { PASSWORD: "", CONFIRM_PASSWORD: "", CURRENT_PASSWORD: "" }
  });

  function onSubmit(values) {
    const password = { PASSWORD: values.PASSWORD, CURRENT_PASSWORD: values.CURRENT_PASSWORD };
    changePassword({ data: password })
      .then(res => {
        toast.success(res);
        setOpenDialog(false);
        form.reset();
      })
      .catch(err => {
        toast.error(err);
      });
  }
  return (
    <>
      <Button
        type="button"
        variant="link"
        onClick={() => {
          setOpenDialog(true);
        }}
        className="p-0 text-sm font-medium text-blue-600 hover:text-blue-600/80"
      >
        Đổi mật khẩu
      </Button>
      <Dialog
        open={openDialog}
        onOpenChange={() => {
          setOpenDialog(false);
          form.reset();
        }}
      >
        <DialogContent
          onOpenAutoFocus={e => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>Cập nhật mật khẩu</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} id="change-password">
              <FormField
                control={form.control}
                name="CURRENT_PASSWORD"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold">Mật khẩu hiện tại</FormLabel>
                    <FormControl>
                      <Password
                        {...field}
                        placeholder="Nhập mật khẩu hiện tại"
                        className="shadow-md focus-visible:ring-offset-0"
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="PASSWORD"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold">Mật khẩu mới</FormLabel>
                    <FormControl>
                      <Password
                        {...field}
                        placeholder="Nhập mật khẩu mới"
                        className="shadow-md focus-visible:ring-offset-0"
                        autoComplete="new-password"
                      />
                    </FormControl>
                    <FormDescription className="flex text-xs font-light">
                      Nhập mật khẩu của bạn
                      <TooltipProvider delayDuration={500}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="ml-1 h-4 w-4 text-blue-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Mật khẩu phải tối thiểu 5 ký tự</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="CONFIRM_PASSWORD"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="text-base font-bold">Nhập lại mật khẩu mới</FormLabel>
                      <FormControl>
                        <Password
                          {...field}
                          placeholder="Nhập lại mật khẩu"
                          className="shadow-md focus-visible:ring-offset-0"
                          autoComplete="confirm-password"
                        />
                      </FormControl>
                      <FormDescription className="flex text-xs font-light">
                        Nhập mật khẩu của bạn
                        <TooltipProvider delayDuration={500}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="ml-1 h-4 w-4 text-blue-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Mật khẩu phải tối thiểu 5 ký tự</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormDescription>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  );
                }}
              />
            </form>
          </Form>
          <DialogFooter>
            <Button
              onClick={() => {
                setOpenDialog(false);
                form.reset();
              }}
              variant="outline"
            >
              Đóng
            </Button>
            <Button form="change-password" variant="blue" type="submit" className="w-[126px]">
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
