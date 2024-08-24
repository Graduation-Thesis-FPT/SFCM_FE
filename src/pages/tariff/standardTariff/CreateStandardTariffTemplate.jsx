import { createTariffTemp } from "@/apis/tariff-temp.api";
import { createStandardTariffTemplate } from "@/apis/trf-std.api";
import { trf_temp } from "@/components/common/aggridreact/dbColumns";
import { CustomSheet } from "@/components/common/custom-sheet";
import { useCustomToast } from "@/components/common/custom-toast";
import { DatePicker } from "@/components/common/date-picker";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays } from "date-fns";
import { PlusCircle } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  TRF_TEMP_NAME: z.string().min(1, "Không được để trống!"),
  FROM_DATE: z.date({
    required_error: "Vui lòng chọn thời ghi hiệu lực từ!"
  }),
  TO_DATE: z.date({
    required_error: "Vui lòng chọn thời ghi hiệu lực đến!"
  })
});

export function CreateStandardTariffTemplate({ onCreateNewTemplate }) {
  const toast = useCustomToast();
  const [open, setOpen] = useState(false);
  const TRF_TEMP = new trf_temp();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      TRF_TEMP_NAME: "",
      FROM_DATE: addDays(new Date(), -30),
      TO_DATE: addDays(new Date(), 30)
    }
  });

  const onSubmit = values => {
    if (values.FROM_DATE >= values.TO_DATE) {
      return toast.error("Thời gian hiệu lực không hợp lệ!");
    }
    values.FROM_DATE = moment(values.FROM_DATE).startOf("day").format();
    values.TO_DATE = moment(values.TO_DATE).endOf("day").format();

    createTariffTemp({ insert: [values], update: [] })
      .then(res => {
        toast.success(res);
        setOpen(false);
        onCreateNewTemplate(res);
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
        className="h-[36px] px-[16px] py-[8px]"
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
                name="TRF_TEMP_NAME"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{TRF_TEMP.TRF_TEMP_NAME.headerName}</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Nhập tên biểu cước" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div></div>
              <FormField
                control={form.control}
                name="FROM_DATE"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{TRF_TEMP.FROM_DATE.headerName}</FormLabel>
                    <FormControl>
                      <DatePicker onSelected={field.onChange} date={field.value} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="TO_DATE"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{TRF_TEMP.TO_DATE.headerName}</FormLabel>
                    <FormControl>
                      <DatePicker onSelected={field.onChange} date={field.value} />
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
