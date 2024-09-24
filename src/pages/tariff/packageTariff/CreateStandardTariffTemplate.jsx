import { createPackageTariff } from "@/apis/package-tariff.api";
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
import { Loader2, PlusCircle } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  NAME: z
    .string({
      required_error: "Không được để trống!"
    })
    .min(1, "Không được để trống!"),
  VALID_FROM: z.date({
    required_error: "Vui lòng chọn thời ghi hiệu lực từ!"
  }),
  VALID_UNTIL: z.date({
    required_error: "Vui lòng chọn thời ghi hiệu lực đến!"
  })
});

export function CreateStandardTariffTemplate({ onCreateNewTemplate }) {
  const toast = useCustomToast();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      NAME: "",
      VALID_FROM: addDays(new Date(), -30),
      VALID_UNTIL: addDays(new Date(), 30)
    }
  });

  const onSubmit = values => {
    if (values.VALID_FROM >= values.VALID_UNTIL) {
      return toast.error("Thời gian hiệu lực không hợp lệ!");
    }
    setLoading(true);
    values.VALID_FROM = moment(values.VALID_FROM).startOf("day").format();
    values.VALID_UNTIL = moment(values.VALID_UNTIL).endOf("day").format();
    createPackageTariff({ insert: [values], update: [] })
      .then(res => {
        toast.success(res);
        setOpen(false);
        onCreateNewTemplate(res);
      })
      .catch(err => {
        toast.error(err);
      })
      .finally(() => {
        setLoading(false);
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
        Tạo biểu cước mới
      </Button>
      <CustomSheet
        open={open}
        onOpenChange={() => {
          setOpen(false);
        }}
        title="Tạo biểu cước mới"
        form={form}
      >
        <CustomSheet.Content title="Thông tin biểu cước">
          <Form {...form}>
            <form
              id="creat-user"
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-2 gap-3 gap-y-5"
            >
              <FormField
                control={form.control}
                name="NAME"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Tên biểu cước</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Nhập tên biểu cước" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="VALID_FROM"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hiệu lực từ ngày</FormLabel>
                    <FormControl>
                      <DatePicker onSelected={field.onChange} date={field.value} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="VALID_UNTIL"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hiệu lực đến ngày</FormLabel>
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
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            form="creat-user"
            type="submit"
            className="h-[36px] w-[126px]"
            variant="blue"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 animate-spin" />}
            Tạo mới
          </Button>
        </CustomSheet.Footer>
      </CustomSheet>
    </>
  );
}
