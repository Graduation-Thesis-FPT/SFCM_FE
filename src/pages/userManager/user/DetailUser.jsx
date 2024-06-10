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
import { findUserById, resetPasswordById, updateUser } from "@/apis/user.api";
import moment from "moment";
import { useCustomToast } from "@/components/custom-toast";
import { Info, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { GrantPermission } from "@/components/common";
import { actionGrantPermission } from "@/constants";

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

export function DetailUser({ detail, open, onOpenChange, handleUpdateUser, roles }) {
  const toast = useCustomToast();
  const [detailUser, setDetailUser] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
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
    setDetailUser(values);
    delete values.USER_NAME;
    updateUser(detail.ROWGUID, values)
      .then(updateRes => {
        findUserById(detail.ROWGUID).then(res => {
          handleUpdateUser(res.data.metadata);
          form.reset();
          onOpenChange();
          toast.success(updateRes);
        });
      })
      .catch(err => {
        toast.error(err);
      });
  }

  const handleResetPassword = () => {
    const DEFAULT_PASSWORD = import.meta.env.VITE_DEFAULT_PASSWORD;
    if (!DEFAULT_PASSWORD || !detail.ROWGUID) {
      toast.error("Lỗi hệ thống, vui lòng thử lại sau!");
      return;
    }
    resetPasswordById(detail.ROWGUID, { DEFAULT_PASSWORD })
      .then(res => {
        toast.success(res);
        setOpenDialog(false);
      })
      .catch(err => {
        toast.error(err);
      });
  };

  useEffect(() => {
    if (!detail.ROWGUID) return;
    findUserById(detail.ROWGUID)
      .then(res => {
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
        setDetailUser(form.getValues());
      })
      .catch(err => {
        toast.error(err);
      });
  }, [detail]);

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent hiddenIconClose={true} className="sm:max-w-1/2 w-1/2 p-0  ">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex h-screen flex-col justify-between overflow-x-auto"
            >
              <span>
                <div className="flex items-center justify-between p-6">
                  <div className="text-xl font-bold text-gray-900">
                    Cập nhật thông tin người dùng
                  </div>
                  <X
                    className="size-4 cursor-pointer hover:opacity-80"
                    onClick={() => {
                      onOpenChange();
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
                            <Input type="text" placeholder="Nhập tài khoản" disabled {...field} />
                          </FormControl>
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
                              <SelectTrigger>
                                <SelectValue placeholder="Chức vụ" />
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
                <span className="flex items-center justify-between p-6">
                  <TooltipProvider delayDuration={500}>
                    <Tooltip>
                      <span className="flex cursor-pointer items-center">
                        <div
                          onClick={() => {
                            setOpenDialog(true);
                          }}
                          className="mr-2 text-sm font-medium text-blue-600 hover:text-blue-600/80 "
                        >
                          Đặt lại mật khẩu
                        </div>
                        <TooltipTrigger asChild>
                          <Info className="size-4 text-gray-400" />
                        </TooltipTrigger>
                      </span>
                      <TooltipContent>
                        <p className="max-w-[237px]">
                          Nếu người dùng quên mật khẩu, admin sẽ đặt lại mật khẩu cho họ. Sau đó,
                          người dùng sẽ sử dụng mật khẩu mặc định để đăng nhập.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <div className="grid grid-cols-2 items-center gap-4">
                    <FormField
                      control={form.control}
                      name="IS_ACTIVE"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <span className="flex items-center">
                              <Switch
                                className="mr-1 h-6 data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-600"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                              <div
                                className={`text-sm font-medium  ${field.value ? "text-blue-600" : "text-gray-600"}`}
                              >
                                {field.value ? "Hoạt động" : "Dừng"}
                              </div>
                            </span>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <GrantPermission action={actionGrantPermission.UPDATE}>
                      <Button type="submit" className="h-[42px] w-[126px]" variant="blue">
                        Lưu thông tin
                      </Button>
                    </GrantPermission>
                  </div>
                </span>
              </span>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
      <Dialog
        open={openDialog}
        onOpenChange={() => {
          setOpenDialog(false);
        }}
      >
        <DialogContent
          onOpenAutoFocus={e => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>Khôi phục lại mật khẩu</DialogTitle>
            <DialogDescription>
              Mật khẩu mặc định sẽ được cấp lại cho người dùng. Bạn có chắc chắn muốn thực hiện
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setOpenDialog(false);
              }}
              type="button"
              variant="outline"
            >
              Hủy
            </Button>
            <Button
              onClick={() => {
                handleResetPassword();
              }}
              type="button"
              variant="blue"
            >
              Khôi phục
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
