import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { createAccount } from "@/apis/user.api";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  ROLE_CODE: z.string({
    required_error: "Không được để trống!"
  }),
  USER_NAME: z.string().trim().min(6, "Tối thiểu 6 ký tự!"),
  BIRTHDAY: z.string().optional(),
  FULLNAME: z.string().refine(data => data === "" || data.length === 6, {
    message: "Tối thiểu 6 ký tự!"
  }),
  TELEPHONE: z.string().refine(data => data === "" || data.length === 10, {
    message: "Số điện thoại bao gồm 11 số!"
  }),
  EMAIL: z.string().refine(data => data === "" || z.string().email().safeParse(data).success, {
    message: "Email không hợp lệ. Vd:abc@gmail.com"
  }),
  ADDRESS: z.string().optional(),
  REMARK: z.string().optional()
});

export function FormCreateAccount() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ROLE_CODE: "admin",
      FULLNAME: "",
      USER_NAME: "",
      BIRTHDAY: "",
      TELEPHONE: "",
      EMAIL: "",
      ADDRESS: "",
      REMARK: ""
    }
  });

  const removeEmptyValues = obj => {
    return Object.fromEntries(Object.entries(obj).filter(([key, value]) => value !== ""));
  };

  function onSubmit(values) {
    const dataReq = removeEmptyValues(values);
    dataReq.BIRTHDAY = new Date().toISOString();
    createAccount(dataReq)
      .then(data => {
        console.log("🚀 ~ onSubmit ~ err:", data);
        form.reset();
        setOpen(false);
      })
      .catch(err => {
        toast({
          variant: "red",
          title: err.message
        });
      });
  }

  return (
    <div>
      <Button
        onClick={() => {
          setOpen(true);
        }}
        variant="blue"
      >
        <PlusCircle className="mr-2 size-5" />
        Tạo người dùng mới
      </Button>
      <Sheet
        open={open}
        onOpenChange={() => {
          setOpen(false);
        }}
      >
        <SheetContent className="sm:max-w-1/2 m-0 w-1/2">
          <SheetHeader className="align-middle">
            <SheetTitle className="pb-4 text-3xl font-bold text-gray-900">
              Tạo mới người dùng
            </SheetTitle>
            <Separator />
            <div className="pb-4 pt-6 text-lg font-medium text-gray-900">Thông tin người dùng</div>
          </SheetHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <span className="grid grid-cols-2 gap-x-4">
                <FormField
                  control={form.control}
                  name="ROLE_CODE"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Nhóm người dùng <span className="text-red">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="focus:ring-offset-0">
                            <SelectValue placeholder="Nhóm người dùng" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="USER_NAME"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Tên tài khoản <span className="text-red">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Nhập tài khoản" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </span>
              <span className="grid grid-cols-2 gap-x-4">
                <FormField
                  control={form.control}
                  name="FULLNAME"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Nhập họ và tên" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="BIRTHDAY"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày sinh</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </span>
              <span className="grid grid-cols-2 gap-x-4">
                <FormField
                  control={form.control}
                  name="EMAIL"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Nhập email" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="TELEPHONE"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Nhập số điện thoại" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </span>
              <FormField
                control={form.control}
                name="ADDRESS"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Nhập địa chỉ" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="REMARK"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Nhập ghi chú" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <span className="absolute bottom-6 right-0 flex w-full flex-col">
                <Separator />
                <div className="gap-2 px-6 pt-6 text-right">
                  <Button
                    onClick={() => {
                      setOpen(false);
                      form.reset();
                    }}
                    className="mr-2"
                    variant="outline"
                    type="button"
                  >
                    Hủy
                  </Button>
                  <Button type="submit">Tạo</Button>
                </div>
              </span>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
