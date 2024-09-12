import { CustomSheet } from "@/components/common/custom-sheet";
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
import { actionGrantPermission } from "@/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  ID: z.string().trim().min(1, "Không được để trống!"),
  NAME: z.string().trim().min(1, "Không được để trống!"),
  ACREAGE: z.number()
});

export function DetailWarehouse({ onOpenChange, detailData, onDeleteData }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    values: {
      ID: detailData.ID,
      NAME: detailData.NAME,
      ACREAGE: detailData.ACREAGE
    }
  });

  const handleDelete = () => {
    onDeleteData([detailData]);
  };

  return (
    <CustomSheet
      open={!!detailData.ID}
      onOpenChange={onOpenChange}
      form={form}
      title="Cập nhật thông tin kho"
    >
      <CustomSheet.Content title="Thông tin kho">
        <Form {...form}>
          <form id="update-warehouse" className="space-y-4" onSubmit={() => {}}>
            <span className="grid grid-cols-3 gap-2">
              <FormField
                control={form.control}
                name="ID"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">
                      Mã kho <span className="text-red">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input disabled type="text" placeholder="Mã kho" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="NAME"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">
                      Tên kho <span className="text-red">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input disabled type="text" placeholder="Tên kho" {...field} />
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
                        disabled
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
      </CustomSheet.Footer>
    </CustomSheet>
  );
}
