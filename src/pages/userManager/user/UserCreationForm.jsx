import { createAccount, findUserById } from "@/apis/user.api";
import { useCustomToast } from "@/components/custom-toast";
import { RoleSelect } from "@/components/form/field/RoleSelect";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { regexPattern } from "@/constants/regexPattern";
import { useToggle } from "@/hooks/useToggle";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  ROLE_CODE: z.string().min(1, "Chọn chức vụ!"),
  USER_NAME: z.string().trim().min(6, "Tối thiểu 6 ký tự!").regex(regexPattern.NO_SPACE, {
    message: "Không được chứa khoảng trắng!"
  }),
  BIRTHDAY: z.string().optional(),
  FULLNAME: z.string().trim().min(6, "Tối thiểu 6 ký tự!").regex(regexPattern.NO_SPECIAL_CHAR, {
    message: "Không chứa ký tự đặc biệt!"
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

export function UserCreationForm({ revalidate }) {
  const toast = useCustomToast();
  const [open, setOpen] = useToggle();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ROLE_CODE: "",
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
    createAccount({ data: dataReq })
      .then(resCreate => {
        toast.success(resCreate);
        form.reset();
        setOpen(false);
        revalidate();
      })
      .catch(err => {
        toast.error(err);
      });
  }

  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
        variant="blue"
        className="h-[36px] px-[16px] py-[8px] text-xs"
      >
        <PlusCircle className="mr-2 size-4" />
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
                <div className="flex items-center justify-between p-4">
                  <div className="text-20 font-bold text-gray-900">Tạo người dùng mới</div>
                  <X
                    className="size-4 cursor-pointer hover:opacity-80"
                    onClick={() => {
                      setOpen(false);
                      form.reset();
                    }}
                  />
                </div>
                <Separator className="bg-gray-400" />

                <div className="space-y-4 p-6">
                  <div className="text-18 font-medium text-gray-900">Thông tin người dùng</div>
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
                    <RoleSelect form={form} />
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
                          <FormMessage>{form.formState.errors.FULLNAME?.message}</FormMessage>
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
                          <FormMessage>{form.formState.errors.BIRTHDAY?.message}</FormMessage>
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
                          <FormMessage>{form.formState.errors.EMAIL?.message}</FormMessage>
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
                          <FormMessage>{form.formState.errors.TELEPHONE?.message}</FormMessage>
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
                        <FormMessage>{form.formState.errors.ADDRESS?.message}</FormMessage>
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
                        <FormMessage>{form.formState.errors.REMARK?.message}</FormMessage>
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
                    className="mr-3 h-[36px] w-[126px] text-blue-600 hover:text-blue-600"
                    variant="outline"
                    type="button"
                  >
                    Hủy
                  </Button>
                  <Button type="submit" className="h-[36px] w-[126px]" variant="blue">
                    Tạo mới
                  </Button>
                </div>
              </span>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </>
  );
}
