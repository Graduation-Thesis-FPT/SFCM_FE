import { createCustomer } from "@/apis/customer.api";
import { createAccount } from "@/apis/user.api";
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
import { Textarea } from "@/components/common/ui/textarea";
import { regexPattern } from "@/constants/regexPattern";
import { useToggle } from "@/hooks/useToggle";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import moment from "moment";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
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
  EMAIL: z.string().trim().min(1, "Email không được để trống").email(`Email không đúng định dạng`),
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
      message: "Địa chỉ không được quá 255 ký tự"
    })
});

export function CustomerCreationForm({ revalidateCustomerList }) {
  const toast = useCustomToast();
  const [open, setOpen] = useToggle();
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
      REMARK: ""
    }
  });

  function onSubmit(values) {
    setLoading(true);
    createCustomer({ data: values })
      .then(res => {
        revalidateCustomerList();
        setLoading(false);
        toast.success(res);
        setOpen(false);
        form.reset();
      })
      .catch(err => {
        toast.error(err);
        setLoading(false);
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
        Tạo khách hàng mới
      </Button>
      <CustomSheet
        open={open}
        onOpenChange={() => {
          setOpen(false);
        }}
        title="Tạo khách hàng mới"
        form={form}
      >
        <CustomSheet.Content title="Thông tin khách hàng">
          <Form {...form}>
            <form id="creat-user" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        <Input type="text" placeholder="Nhập mã khách hàng" {...field} />
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
                      <Input type="text" placeholder="Nhập email" {...field} />
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
            </form>
          </Form>
        </CustomSheet.Content>
        <CustomSheet.Footer>
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
          <Button
            loading={loading}
            form="creat-user"
            type="submit"
            className="h-[36px] w-[126px]"
            variant="blue"
          >
            Tạo mới
          </Button>
        </CustomSheet.Footer>
      </CustomSheet>
    </>
  );
}
