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
import { useCustomToast } from "@/components/custom-toast";
import { GrantPermission } from "@/components/common";
import { actionGrantPermission } from "@/constants";
import { CustomSheet } from "@/components/custom-sheet";
import { createWarehouse, getAllWarehouse } from "@/apis/warehouse.api";

const formSchema = z.object({
  WAREHOUSE_CODE: z.string().trim().min(1, "Không được để trống!"),
  WAREHOUSE_NAME: z.string().trim().min(1, "Không được để trống!"),
  ACREAGE: z.number()
});

export function FormCreateWarehouse({ open, onOpenChange, onCreateData }) {
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
    let createData = { insert: [values], update: [] };
    createWarehouse(createData)
      .then(res => {
        onCreateData(res.data.metadata.createdWarehouse);
        onOpenChange();
        toast.success(res);
      })
      .catch(err => {
        toast.error(err);
      });
  };
  return (
    <CustomSheet open={open} onOpenChange={onOpenChange} title="Tạo kho mới">
      <CustomSheet.Content title="Thông tin kho">
        <Form {...form}>
          <form id="create-warehouse" className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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

      <CustomSheet.Footer>
        <GrantPermission action={actionGrantPermission.CREATE}>
          <Button
            type="submit"
            form="create-warehouse"
            className="h-[42px] w-[126px]"
            variant="blue"
          >
            Tạo mới
          </Button>
        </GrantPermission>
      </CustomSheet.Footer>
    </CustomSheet>
  );
}
