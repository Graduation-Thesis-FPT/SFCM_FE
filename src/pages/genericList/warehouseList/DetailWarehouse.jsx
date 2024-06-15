import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/common/ui/button";
import { Input } from "@/components/common/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/common/ui/form";
import { useCustomToast } from "@/components/common/custom-toast";
import { GrantPermission } from "@/components/common/grant-permission";
import { actionGrantPermission } from "@/constants";
import { CustomSheet } from "@/components/common/custom-sheet";
import { useEffect } from "react";
import { deleteWarehouse } from "@/apis/warehouse.api";

const formSchema = z.object({
  WAREHOUSE_CODE: z.string().trim().min(1, "Không được để trống!"),
  WAREHOUSE_NAME: z.string().trim().min(1, "Không được để trống!"),
  ACREAGE: z.number()
});

export function DetailWarehouse({ open, onOpenChange, detailData, onDeleteData }) {
  const toast = useCustomToast();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      WAREHOUSE_CODE: "",
      WAREHOUSE_NAME: "",
      ACREAGE: 0
    }
  });

  const onSubmit = values => {
    console.log("🚀 ~ DetailWarehouse ~ values:", values);
  };

  const handleDelete = () => {
    onDeleteData(detailData);
  };

  useEffect(() => {
    form.reset();
    Object.keys(detailData).map(key => {
      form.setValue(key, detailData[key] ?? "");
    });
  }, [detailData]);

  return (
    <CustomSheet open={open} onOpenChange={onOpenChange} title="Tạo kho mới">
      <CustomSheet.Content title="Thông tin kho">
        <Form {...form}>
          <form id="update-warehouse" className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <span className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="WAREHOUSE_CODE"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">
                      Mã kho <span className="text-red">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Mã kho" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="WAREHOUSE_NAME"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">
                      Tên kho <span className="text-red">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Tên kho" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ACREAGE"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">
                      Diện tích <span className="text-red">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Diện tích"
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
            </span>
          </form>
        </Form>
      </CustomSheet.Content>

      <CustomSheet.Footer className="gap-4">
        <GrantPermission action={actionGrantPermission.DELETE}>
          <Button
            onClick={() => {
              handleDelete();
            }}
            type="button"
            className="h-[36px] w-[126px]"
            variant="red"
          >
            Xóa kho
          </Button>
        </GrantPermission>
        {/* <GrantPermission action={actionGrantPermission.UPDATE}>
          <Button
            type="submit"
            form="update-warehouse"
            className="h-[36px] w-[126px]"
            variant="blue"
          >
            Cập nhật
          </Button>
        </GrantPermission> */}
      </CustomSheet.Footer>
    </CustomSheet>
  );
}
