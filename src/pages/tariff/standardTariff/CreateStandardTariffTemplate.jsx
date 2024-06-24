import { createAndUpdateStandardTariff } from "@/apis/trf-std.api";
import { trf_std } from "@/components/common/aggridreact/dbColumns";
import { CustomSheet } from "@/components/common/custom-sheet";
import { useCustomToast } from "@/components/common/custom-toast";
import { DatePickerWithRangeInForm } from "@/components/common/date-range-picker";
import { Button } from "@/components/common/ui/button";
import { Checkbox } from "@/components/common/ui/checkbox";
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
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/common/ui/select";
import { useToggle } from "@/hooks/useToggle";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays } from "date-fns";
import { PlusCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  FROM_DATE: z.date({
    required_error: "Vui lòng chọn khoảng thời gian hiệu lực"
  }),
  TO_DATE: z.date({
    required_error: "Vui lòng chọn khoảng thời gian hiệu lực!"
  }),
  TRF_NAME: z.string().min(1, "Không được để trống!"),
  TRF_CODE: z.string().min(1, "Không được để trống!"),
  TRF_DESC: z.string(),
  METHOD_CODE: z.string().min(1, "Không được để trống!"),
  ITEM_TYPE_CODE: z.string().min(1, "Không được để trống!"),
  AMT_CBM: z.number(),
  VAT: z.number(),
  INCLUDE_VAT: z.boolean()
});

export function CreateStandardTariffTemplate({
  tariffCode = [],
  method = [],
  itemType = [],
  onCreateNewTemplate
}) {
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
      AMT_CBM: 0,
      VAT: 0,
      INCLUDE_VAT: false
    }
  });

  const onSubmit = values => {
    createAndUpdateStandardTariff({ insert: [values], update: [] })
      .then(res => {
        toast.success(res);
        setOpen(false);
        onCreateNewTemplate(res.data);
      })
      .catch(err => {
        toast.error(err);
      });
  };

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
        <CustomSheet.Content title="Thông tin mẫu biểu cước">
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn mã biểu cước" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {tariffCode.map(item => (
                              <SelectItem key={item?.TRF_CODE} value={item?.TRF_CODE}>
                                {item?.TRF_CODE} - {item?.TRF_DESC}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn mã phương án" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {method.map(item => (
                              <SelectItem key={item?.METHOD_CODE} value={item?.METHOD_CODE}>
                                {item?.METHOD_CODE} - {item?.METHOD_NAME}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn mã loại hàng" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {itemType.map(item => (
                              <SelectItem key={item?.ITEM_TYPE_CODE} value={item?.ITEM_TYPE_CODE}>
                                {item?.ITEM_TYPE_CODE} - {item?.ITEM_TYPE_NAME}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
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
                name="AMT_CBM"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{TRF_STD.AMT_CBM.headerName}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Nhập tài khoản"
                        {...field}
                        onChange={e => {
                          field.onChange(Number(e.target.value));
                        }}
                      />
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
                      <Input
                        type="number"
                        placeholder="Nhập tài khoản"
                        {...field}
                        onChange={e => {
                          field.onChange(Number(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="INCLUDE_VAT"
                render={({ field }) => (
                  <FormItem className="flex items-end space-x-3">
                    <FormLabel>{TRF_STD.INCLUDE_VAT.headerName}</FormLabel>
                    <FormControl>
                      <Checkbox
                        className=" size-5 border-gray-400 data-[state=checked]:bg-blue-600"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
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
    </>
  );
}
