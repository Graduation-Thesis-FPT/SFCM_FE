import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { findUserById, updateUser } from "@/apis/user.api";
import moment from "moment";
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
  REMARK: z.string().optional(),
  IS_ACTIVE: z.boolean()
});

export function DetailUser({ detail, open, onOpenChange, handleUpdateUser }) {
  const toast = useCustomToast();
  const [detailUser, setDetailUser] = useState({});
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
      REMARK: "",
      IS_ACTIVE: false
    }
  });

  function onSubmit(values) {
    let dataReq = Object.fromEntries(
      Object.entries(values).filter(([key, value]) => value !== detailUser[key])
    );
    let temp = { ...detailUser };
    Object.keys(dataReq).forEach(item => {
      if (temp.hasOwnProperty(item)) {
        temp[item] = dataReq[item];
      }
    });
    delete temp.ROWGUID;
    if (temp.USER_NAME === detailUser.USER_NAME) {
      delete temp.USER_NAME;
    }
    updateUser(detail.ROWGUID, temp)
      .then(res => {
        temp.ROWGUID = detail.ROWGUID;
        temp.USER_NAME ??= detailUser.USER_NAME;
        setDetailUser(temp);
        handleUpdateUser(temp);
        toast.success(res.data.message);
      })
      .catch(err => {
        toast.error(err?.response?.data?.message || err.message);
      });
  }

  useEffect(() => {
    if (!detail.ROWGUID) return;
    findUserById(detail.ROWGUID)
      .then(res => {
        setDetailUser(res.data.metadata);
        form.setValue("ROLE_CODE", res.data.metadata.ROLE_CODE || "");
        form.setValue("FULLNAME", res.data.metadata.FULLNAME || "");
        form.setValue("USER_NAME", res.data.metadata.USER_NAME || "");
        form.setValue(
          "BIRTHDAY",
          res.data.metadata.BIRTHDAY ? moment(res.data.metadata.BIRTHDAY).format("YYYY-MM-DD") : ""
        );
        form.setValue("TELEPHONE", res.data.metadata.TELEPHONE || "");
        form.setValue("EMAIL", res.data.metadata.EMAIL || "");
        form.setValue("ADDRESS", res.data.metadata.ADDRESS || "");
        form.setValue("REMARK", res.data.metadata.REMARK || "");
        form.setValue("IS_ACTIVE", res.data.metadata.IS_ACTIVE);
      })
      .catch(err => {});
  }, [detail]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-1/2 m-0 w-1/2">
        <SheetHeader className="align-middle">
          <SheetTitle className="pb-4 text-3xl font-bold text-gray-900">
            Chi tiết người dùng
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
                        <SelectItem value="manage">Manage</SelectItem>
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
            <FormField
              control={form.control}
              name="IS_ACTIVE"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <FormControl>
                    <span className="flex items-center space-x-2">
                      <Switch
                        className="data-[state=checked]:bg-green-800 data-[state=unchecked]:bg-red-800"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <div>{field.value ? "Hoạt động" : "Dừng"}</div>
                    </span>
                  </FormControl>
                </FormItem>
              )}
            />
            <span className="absolute bottom-6 right-0 flex w-full flex-col">
              <Separator />
              <div className="gap-2 px-6 pt-6 text-right">
                <Button
                  onClick={() => {
                    onOpenChange(false);
                  }}
                  className="mr-2"
                  variant="outline"
                  type="button"
                >
                  Hủy
                </Button>
                <Button type="submit">Cập nhật</Button>
              </div>
            </span>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
