import { updateCustomer } from "@/apis/customer.api";
import { CustomSheet } from "@/components/common/custom-sheet";
import { useCustomToast } from "@/components/common/custom-toast";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/common/ui/select";
import { Switch } from "@/components/common/ui/switch";
import { Textarea } from "@/components/common/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/common/ui/tooltip";
import { regexPattern } from "@/constants/regexPattern";
import { useToggle } from "@/hooks/useToggle";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CustomerPasswordReset } from "./CustomerPasswordReset";
import { actionGrantPermission } from "@/constants";
import { GrantPermission } from "@/components/common/grant-permission";

const formSchema = z
  .object({
    ID: z
      .string()
      .trim()
      .min(1, "Mã khách hàng không được để trống")
      .max(255, "Mã khách hàng không được quá 255 ký tự")
      .regex(regexPattern.NO_SPECIAL_CHAR, {
        message: "Mã khách hàng không được chứa ký tự đặc biệt"
      })
      .regex(regexPattern.NO_SPACE, { message: "Mã khách hàng không được khoảng trắng" }),
    TAX_CODE: z
      .string({
        required_error: `Mã số thuế không được để trống`,
        invalid_type_error: `Mã số thuế không được để trống`
      })
      .trim()
      .min(1, `Mã số thuế không được để trống`)
      .regex(regexPattern.TAX_CODE, {
        message: `Mã số thuế phải là 10 chữ số hoặc 10 chữ số theo sau là dấu gạch nối và 3 chữ số`
      }),
    CUSTOMER_TYPE: z.string().refine(data => data === "SHIPPER" || data === "CONSIGNEE", {
      message: "Loại khách hàng không hợp lệ"
    }),
    FULLNAME: z
      .string()
      .trim()
      .min(6, "Tên khách hàng tối thiểu 6 ký tự")
      .max(255, "Tên khách hàng không được quá 255 ký tự"),
    EMAIL: z
      .string()
      .trim()
      .min(1, "Email không được để trống")
      .email(`Email không đúng định dạng`),
    ADDRESS: z
      .string()
      .trim()
      .min(1, "Địa chỉ không được để trống")
      .max(255, "Địa chỉ không được quá 255 ký tự"),
    TELEPHONE: z.string().refine(data => data === "" || data.length === 10, {
      message: "Số điện thoại bao gồm 11 số"
    }),
    BIRTHDAY: z.string().refine(
      dateString => {
        const date = moment(dateString);
        const today = moment();
        const age = today.diff(date, "years");
        return dateString === "" || (date.isBefore(today, "day") && age >= 18);
      },
      {
        message: "Ngày sinh không hợp lệ. Khách hàng phải trên 18 tuổi"
      }
    ),
    REMARK: z
      .string()
      .trim()
      .refine(data => data === "" || data.length <= 255, {
        message: "Ghi chú không được quá 255 ký tự"
      }),
    IS_ACTIVE: z.boolean()
  })
  .refine(data => data.IS_ACTIVE || (!data.IS_ACTIVE && data.REMARK !== ""), {
    message: "Vui lòng nhập lý do dừng hoạt động khách hàng này",
    path: ["REMARK"]
  });

export function CustomerUpdateForm({ customerDetail = {}, revalidateCustomerList, onOpenChange }) {
  const toast = useCustomToast();
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useToggle();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ID: "",
      TAX_CODE: "",
      FULLNAME: "",
      CUSTOMER_TYPE: "SHIPPER",
      BIRTHDAY: "",
      ADDRESS: "",
      TELEPHONE: "",
      EMAIL: "",
      REMARK: "",
      IS_ACTIVE: true
    }
  });

  useEffect(() => {
    if (!customerDetail.ID) return;
    form.setValue("ID", customerDetail.ID || "");
    form.setValue("TAX_CODE", customerDetail.TAX_CODE || "");
    form.setValue("FULLNAME", customerDetail.FULLNAME || "");
    form.setValue("CUSTOMER_TYPE", customerDetail.CUSTOMER_TYPE || "SHIPPER");
    form.setValue(
      "BIRTHDAY",
      customerDetail.BIRTHDAY ? moment(customerDetail.BIRTHDAY).format("YYYY-MM-DD") : ""
    );
    form.setValue("ADDRESS", customerDetail.ADDRESS || "");
    form.setValue("TELEPHONE", customerDetail.TELEPHONE || "");
    form.setValue("EMAIL", customerDetail.EMAIL || "");
    form.setValue("REMARK", customerDetail.REMARK || "");
    form.setValue("IS_ACTIVE", customerDetail.IS_ACTIVE);
  }, [customerDetail]);

  function onSubmit(values) {
    setLoading(true);
    updateCustomer({ data: values })
      .then(res => {
        revalidateCustomerList();
        toast.success(res);
        onOpenChange();
        form.reset();
      })
      .catch(err => {
        toast.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      <CustomSheet
        open={customerDetail.ID}
        onOpenChange={onOpenChange}
        title="Chỉnh sửa thông tin khách hàng"
        form={form}
      >
        <Form {...form}>
          <form
            id="update-customer"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-1 flex-col"
          >
            <CustomSheet.Content title="Thông tin khách hàng">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-x-4">
                  <FormField
                    control={form.control}
                    name="ID"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Mã khách hàng <span className="text-red">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input disabled type="text" placeholder="Nhập mã khách hàng" {...field} />
                        </FormControl>
                        <FormMessage>{form.formState.errors.ID?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="TAX_CODE"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Mã số thuế <span className="text-red">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Nhập mã số thuế" {...field} />
                        </FormControl>
                        <FormMessage>{form.formState.errors.TAX_CODE?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="CUSTOMER_TYPE"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Loại khách hàng <span className="text-red">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="focus:ring-offset-0">
                              <SelectValue placeholder="Loại khách hàng" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="SHIPPER">Đại lý</SelectItem>
                            <SelectItem value="CONSIGNEE">Chủ hàng</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage>{form.formState.errors.CUSTOMER_TYPE?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 gap-x-4">
                  <FormField
                    control={form.control}
                    name="FULLNAME"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Tên khách hàng <span className="text-red">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Nhập tên khách hàng" {...field} />
                        </FormControl>
                        <FormMessage>{form.formState.errors.FULLNAME?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="EMAIL"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Email <span className="text-red">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input disabled type="text" placeholder="Nhập email" {...field} />
                      </FormControl>
                      <FormMessage>{form.formState.errors.EMAIL?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ADDRESS"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Địa chỉ <span className="text-red">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Nhập địa chỉ" {...field} />
                      </FormControl>
                      <FormMessage>{form.formState.errors.ADDRESS?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-x-4">
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
                <FormField
                  control={form.control}
                  name="REMARK"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ghi chú</FormLabel>
                      <FormControl>
                        <Textarea type="text" placeholder="Nhập ghi chú" {...field} />
                      </FormControl>
                      <FormMessage>{form.formState.errors.REMARK?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>
            </CustomSheet.Content>
            <GrantPermission action={actionGrantPermission.UPDATE}>
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
                  <Button
                    disabled={!form.formState.isDirty}
                    loading={loading}
                    form="update-customer"
                    type="submit"
                    className="h-[36px] w-[126px]"
                    variant="blue"
                  >
                    Cập nhật
                  </Button>
                </div>
              </CustomSheet.Footer>
            </GrantPermission>
          </form>
        </Form>
        <CustomerPasswordReset
          detail={customerDetail}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          onOpenChange={onOpenChange}
        />
      </CustomSheet>
    </>
  );
}
