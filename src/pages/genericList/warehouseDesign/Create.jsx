import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useCustomToast } from "@/components/custom-toast";
import { GrantPermission } from "@/components/common";
import { ERROR_MESSAGE, SUCCESS_MESSAGE, actionGrantPermission } from "@/constants";
import { CustomSheet } from "@/components/custom-sheet";
import { createBlock } from "@/apis/block.api";

const formSchema = z.object({
  BLOCK_NAME: z.string().trim().min(1, "Không được để trống!"),
  WAREHOUSE_CODE: z.string().trim().min(1, "Không được để trống!"),
  TIER_COUNT: z
    .string()
    .refine(value => value === "" || /^\d*$/.test(value), "Chỉ nhập số nguyên dương"),
  SLOT_COUNT: z
    .string()
    .refine(value => value === "" || /^\d*$/.test(value), "Chỉ nhập số nguyên dương"),
  BLOCK_WIDTH: z
    .string()
    .refine(value => value === "" || /^\d*$/.test(value), "Chỉ nhập số nguyên dương"),
  BLOCK_HEIGHT: z
    .string()
    .refine(value => value === "" || /^\d*$/.test(value), "Chỉ nhập số nguyên dương")
});

export function Create({ open, onOpenChange }) {
  const toast = useCustomToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      BLOCK_NAME: "",
      WAREHOUSE_CODE: "",
      TIER_COUNT: "",
      SLOT_COUNT: "",
      BLOCK_HEIGHT: "",
      BLOCK_WIDTH: ""
    }
  });

  const onSubmit = values => {
    createBlock(values)
      .then(res => {
        toast.success(res);
      })
      .catch(err => {
        toast.error(err);
      });
  };

  return (
    <div>
      <CustomSheet open={open} onOpenChange={onOpenChange} title="Tạo dãy mới">
        <CustomSheet.Content title="Thông tin dãy">
          <Form {...form}>
            <form
              id="detail-warehouse-design"
              className="space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <span className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="BLOCK_NAME"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-600">
                        Mã dãy <span className="text-red">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="WAREHOUSE_CODE"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-600">
                        Mã kho <span className="text-red">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </span>

              <span className="grid grid-cols-4 gap-x-4 gap-y-2">
                <div className="col-span-2 text-sm font-medium">Thông số</div>
                <div className="col-span-2 text-sm font-medium">Diện tích</div>
                <FormField
                  control={form.control}
                  name="TIER_COUNT"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-600">Số tầng</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="SLOT_COUNT"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-600">Số dãy</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="BLOCK_HEIGHT"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-600">Chiều dài</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="BLOCK_WIDTH"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-600">Chiều rộng</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </span>
            </form>
          </Form>
        </CustomSheet.Content>

        <CustomSheet.Footer>
          <GrantPermission action={actionGrantPermission.CREATE}>
            <Button
              type="submit"
              form="detail-warehouse-design"
              className="h-[42px] w-[126px]"
              variant="blue"
            >
              Tạo mới
            </Button>
          </GrantPermission>
        </CustomSheet.Footer>
      </CustomSheet>
    </div>
  );
}
