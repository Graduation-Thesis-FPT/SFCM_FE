import { findUserById, updateUser } from "@/apis/user.api";
import { CustomSheet } from "@/components/common/custom-sheet";
import { useCustomToast } from "@/components/common/custom-toast";
import { GrantPermission } from "@/components/common/grant-permission";
import { Button } from "@/components/common/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/common/ui/form";
import { Input } from "@/components/common/ui/input";
import { Switch } from "@/components/common/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/common/ui/tooltip";
import { RoleSelect } from "@/components/user-management/RoleSelect";
import { actionGrantPermission } from "@/constants";
import { regexPattern } from "@/constants/regexPattern";
import useFetchData from "@/hooks/useRefetchData";
import { useToggle } from "@/hooks/useToggle";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import moment from "moment";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UserPasswordReset } from "./UserPasswordReset";

const formSchema = z.object({
  ROLE_CODE: z.string().min(1, "Chọn chức vụ!"),
  USER_NAME: z.string().trim().min(6, "Tối thiểu 6 ký tự!").regex(regexPattern.NO_SPACE, {
    message: "Không được chứa khoảng trắng!"
  }),
  BIRTHDAY: z
    .string()
    .refine(
      dateString => {
        const date = moment(dateString);
        const today = moment();
        const age = today.diff(date, "years");
        return dateString === "" || (date.isBefore(today, "day") && age >= 18);
      },
      {
        message: "Ngày sinh không hợp lệ. Bạn phải trên 18 tuổi và ngày sinh không thể là hôm nay."
      }
    )
    .optional(),
  FULLNAME: z.string().trim().min(6, "Tối thiểu 6 ký tự!").regex(regexPattern.NO_SPECIAL_CHAR, {
    message: "Không chứa ký tự đặc biệt!"
  }),
  TELEPHONE: z.string().refine(data => data === "" || data.length === 10, {
    message: "Số điện thoại bao gồm 11 số!"
  }),

  EMAIL: z
    .string()
    .trim()
    .refine(data => data === "" || z.string().email().safeParse(data).success, {
      message: "Email không hợp lệ. Vd:abc@gmail.com"
    }),
  ADDRESS: z
    .string()
    .trim()
    .refine(data => data === "" || data.length <= 500, {
      message: "Địa chỉ không được quá 500 ký tự!"
    }),
  REMARK: z.string().trim().optional(),
  IS_ACTIVE: z.boolean()
});

export function UserUpdateForm({ detail = {}, revalidate, onOpenChange }) {
  const toast = useCustomToast();
  const [openDialog, setOpenDialog] = useToggle();
  const [btnLoading, setBtnLoading] = useToggle();
  const { data: user } = useFetchData({
    service: findUserById,
    params: { id: detail.ROWGUID },
    dependencies: [detail.ROWGUID],
    shouldFetch: !!detail.ROWGUID
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    values: {
      ROLE_CODE: user?.ROLE_CODE || "",
      FULLNAME: user?.FULLNAME || "",
      USER_NAME: user?.USER_NAME || "",
      BIRTHDAY: user?.BIRTHDAY ? moment(user?.BIRTHDAY).format("YYYY-MM-DD") : "",
      TELEPHONE: user?.TELEPHONE || "",
      EMAIL: user?.EMAIL || "",
      ADDRESS: user?.ADDRESS || "",
      REMARK: user?.REMARK || "",
      IS_ACTIVE: user?.IS_ACTIVE || false
    }
  });

  function onSubmit(values) {
    setBtnLoading(true);
    let { USER_NAME, ...rest } = values;
    updateUser({ id: detail.ROWGUID, data: rest })
      .then(updateRes => {
        setBtnLoading(false);
        form.reset();
        onOpenChange();
        revalidate();
        toast.success(updateRes);
      })
      .catch(err => {
        toast.error(err);
        setBtnLoading(false);
      });
  }

  return (
    <>
      <CustomSheet
        open={!!detail.ROWGUID}
        onOpenChange={onOpenChange}
        form={form}
        title="Cập nhật thông tin người dùng"
      >
        <Form {...form}>
          <form
            id="update-user"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-1 flex-col"
          >
            <CustomSheet.Content title="Thông tin người dùng">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-x-4">
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
                        <FormMessage>{form.formState.errors.USER_NAME?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                  <RoleSelect form={form} />
                </div>
                <div className="grid grid-cols-2 gap-x-4">
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
                </div>
                <div className="grid grid-cols-2 gap-x-4">
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
                </div>
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
            </CustomSheet.Content>
            <CustomSheet.Footer className="flex justify-between px-6 py-4">
              <div className="flex flex-row items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => {
                    setOpenDialog(true);
                  }}
                  className="p-0 text-sm font-medium text-blue-600 hover:text-blue-600/80"
                >
                  Đặt lại mật khẩu
                </Button>
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="size-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-[230px]">
                        Nếu người dùng quên mật khẩu, admin sẽ đặt lại mật khẩu cho họ. Sau đó,
                        người dùng sẽ sử dụng mật khẩu mặc định để đăng nhập.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="grid grid-cols-2 items-center gap-2.5">
                <FormField
                  control={form.control}
                  name="IS_ACTIVE"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center justify-center gap-2">
                          <Switch
                            className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-600"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <div
                            className={`flex w-20 text-sm font-medium  ${field.value ? "text-blue-600" : "text-gray-600"}`}
                          >
                            {field.value ? "Hoạt động" : "Dừng"}
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <GrantPermission action={actionGrantPermission.UPDATE}>
                  <Button
                    id="update-user"
                    disabled={!form.formState.isDirty}
                    type="submit"
                    className="h-[36px] w-[126px]"
                    variant="blue"
                    loading={btnLoading}
                  >
                    Lưu thông tin
                  </Button>
                </GrantPermission>
              </div>
            </CustomSheet.Footer>
          </form>
        </Form>
      </CustomSheet>
      <UserPasswordReset detail={user} openDialog={openDialog} setOpenDialog={setOpenDialog} />
    </>
  );
}
