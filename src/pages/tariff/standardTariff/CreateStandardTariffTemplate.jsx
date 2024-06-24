import { createAccount, findUserById } from "@/apis/user.api";
import { trf_std } from "@/components/common/aggridreact/dbColumns";
import { CustomSheet } from "@/components/common/custom-sheet";
import { useCustomToast } from "@/components/common/custom-toast";
import { DatePickerWithRangeInForm } from "@/components/common/date-range-picker";
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
import { Separator } from "@/components/common/ui/separator";
import { Sheet, SheetContent } from "@/components/common/ui/sheet";
import { RoleSelect } from "@/components/user-management/RoleSelect";
import { regexPattern } from "@/constants/regexPattern";
import { useToggle } from "@/hooks/useToggle";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays } from "date-fns";
import { PlusCircle, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  FROM_DATE: z.date({
    required_error: "Vui lòng chọn khoảng thời gian hiệu lực"
  }),
  TO_DATE: z.date({
    required_error: "Vui lòng chọn khoảng thời gian hiệu lực!"
  }),
  TRF_NAME: z.string(),
  TRF_CODE: z.string(),
  TRF_DESC: z.string(),
  METHOD_CODE: z.string(),
  ITEM_TYPE_CODE: z.string(),
  AMT_CBM: z.string(),
  VAT: z.string(),
  INCLUDE_VAT: z.string()
});

export function CreateStandardTariffTemplate() {
  const toast = useCustomToast();
  const [open, setOpen] = useToggle();
  const TRF_STD = new trf_std();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      FROM_DATE: addDays(new Date(), -30),
      TO_DATE: addDays(new Date(), 30),
      TRF_NAME: "",
      TRF_CODE: "",
      TRF_DESC: "",
      METHOD_CODE: "",
      ITEM_TYPE_CODE: "",
      AMT_CBM: "",
      VAT: "",
      INCLUDE_VAT: ""
    }
  });

  const onSubmit = values => {
    console.log("🚀 ~ CreateStandardTariffTemplate ~ values:", values);
  };

  return (
    <div>
      <Button
        onClick={() => {
          setOpen(true);
        }}
        variant="blue"
        className="h-[36px] px-[16px] py-[8px] text-xs"
      >
        <PlusCircle className="mr-2 size-4" />
        Tạo mẫu biểu cước
      </Button>
      <CustomSheet
        open={open}
        onOpenChange={() => {
          setOpen(false);
        }}
        title="Tạo mẫu biểu cước mới"
        form={form}
      >
        <CustomSheet.Content title="Thông tin biểu cước">
          <Form {...form}>
            <form
              id="creat-user"
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-2 gap-3"
            >
              <FormField
                control={form.control}
                name="TO_DATE"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thời gian hiệu lực *</FormLabel>
                    <FormControl>
                      <DatePickerWithRangeInForm
                        className="w-full"
                        date={{ from: form.getValues("FROM_DATE"), to: form.getValues("TO_DATE") }}
                        onSelected={value => {
                          form.setValue("FROM_DATE", value?.from);
                          form.setValue("TO_DATE", value?.to);
                        }}
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors?.FROM_DATE?.message ||
                        form.formState.errors?.TO_DATE?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="TRF_NAME"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{TRF_STD.TRF_NAME.headerName}</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Nhập tên biểu cước" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="TRF_CODE"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{TRF_STD.TRF_CODE.headerName}</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Nhập tài khoản" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="TRF_DESC"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{TRF_STD.TRF_DESC.headerName}</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Nhập mô tả" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="METHOD_CODE"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{TRF_STD.METHOD_CODE.headerName}</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Nhập tài khoản" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ITEM_TYPE_CODE"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{TRF_STD.ITEM_TYPE_CODE.headerName}</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Nhập tài khoản" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="AMT_CBM"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{TRF_STD.AMT_CBM.headerName}</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Nhập tài khoản" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="VAT"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{TRF_STD.VAT.headerName}</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Nhập tài khoản" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="INCLUDE_VAT"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{TRF_STD.INCLUDE_VAT.headerName}</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Nhập tài khoản" {...field} />
                    </FormControl>
                    <FormMessage />
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
          <Button form="creat-user" type="submit" className="h-[36px] w-[126px]" variant="blue">
            Tạo mới
          </Button>
        </CustomSheet.Footer>
      </CustomSheet>
    </div>
  );
}
