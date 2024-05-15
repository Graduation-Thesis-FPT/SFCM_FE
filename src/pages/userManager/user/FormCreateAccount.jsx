import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { PlusCircle, X } from "lucide-react";
import { createAccount, findUserById } from "@/apis/user.api";
import { Separator } from "@/components/ui/separator";
import { useCustomToast } from "@/components/custom-toast";

const formSchema = z.object({
  ROLE_CODE: z.string({
    required_error: "Không được để trống!"
  }),
  USER_NAME: z.string().trim().min(6, "Tối thiểu 6 ký tự!"),
  BIRTHDAY: z.string().optional(),
  FULLNAME: z.string().refine(data => data === "" || data.length >= 6, {
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

export function FormCreateAccount({ roles, handleCreateUser }) {
  const toast = useCustomToast();
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ROLE_CODE: "manage",
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
    createAccount(dataReq)
      .then(res => {
        findUserById(res.data.metadata.ROWGUID)
          .then(res => {
            const newAccount = res.data.metadata;
            handleCreateUser(newAccount);
            toast.success(res.data.message);
            form.reset();
            setOpen(false);
          })
          .catch(err => {
            toast.error(err?.response?.data?.message || err.message);
          });
      })
      .catch(err => {
        toast.error(err?.response?.data?.message || err.message);
      });
  }

  return (
    <div>
      <Button
        onClick={() => {
          setOpen(true);
        }}
        variant="blue"
        className="h-12"
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
        <SheetContent hiddenIconClose={true} className="sm:max-w-1/2 w-1/2 p-0">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex h-screen flex-col justify-between overflow-x-auto"
            >
              <span>
                <div className="flex items-center justify-between p-6">
                  <div className="text-xl font-bold text-gray-900">Tạo người dùng mới</div>
                  <X
                    className="size-4 cursor-pointer hover:opacity-80"
                    onClick={() => {
                      setOpen(false);
                    }}
                  />
                </div>
                <Separator className="bg-gray-400" />

                <div className="space-y-4 p-6">
                  <div className="text-lg font-medium text-gray-900">Thông tin người dùng</div>
                  <span className="grid grid-cols-2 gap-x-4">
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
                          <FormMessage>{form.formState.errors.USER_NAME?.message}</FormMessage>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ROLE_CODE"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Chức vụ <span className="text-red">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="focus:ring-offset-0">
                                <SelectValue placeholder=" Chức vụ" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {roles?.map(role => (
                                <SelectItem key={role.ROLE_CODE} value={role.ROLE_CODE}>
                                  {role.ROLE_NAME}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                </div>
              </span>

              <span>
                <Separator className="bg-gray-200" />
                <div className="p-6 text-right">
                  <Button
                    onClick={() => {
                      setOpen(false);
                      form.reset();
                    }}
                    className="mr-3 h-[48px] w-[126px] text-blue-600 hover:text-blue-600"
                    variant="outline"
                    type="button"
                  >
                    Hủy
                  </Button>
                  <Button type="submit" className="h-12 w-[126px]" variant="blue">
                    Tạo mới
                  </Button>
                </div>
              </span>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
