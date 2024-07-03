import { createWarehouse } from "@/apis/warehouse.api";
import { CustomSheet } from "@/components/common/custom-sheet";
import { useCustomToast } from "@/components/common/custom-toast";
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
import { useToggle } from "@/hooks/useToggle";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  WAREHOUSE_CODE: z.string().trim().min(1, "Không được để trống!"),
  WAREHOUSE_NAME: z.string().trim().min(1, "Không được để trống!"),
  ACREAGE: z.number()
});

export function FormCreateWarehouse({ revalidate }) {
  const toast = useCustomToast();
  const [open, setOpen] = useToggle();
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
    createWarehouse({ data: createData })
      .then(res => {
        toast.success(res);
        form.reset();
        revalidate();
        setOpen(false);
      })
      .catch(err => {
        toast.error(err);
      });
  };

  return (
    <>
      <Button
        variant="blue"
        className="h-[36px] px-[16px] py-[8px] text-xs"
        onClick={() => {
          setOpen(true);
        }}
      >
        <PlusCircle className="mr-2 size-4" />
        Tạo kho mới
      </Button>
      <CustomSheet
        open={open}
        onOpenChange={() => {
          setOpen(false);
        }}
        title="Tạo kho mới"
      >
        <CustomSheet.Content title="Thông tin kho">
          <Form {...form}>
            <form
              id="create-warehouse"
              className="space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="grid grid-cols-3 gap-4">
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
              </div>
            </form>
          </Form>
        </CustomSheet.Content>

        <CustomSheet.Footer>
          <GrantPermission action={actionGrantPermission.CREATE}>
            <Button
              type="submit"
              form="create-warehouse"
              className="h-[36px] w-[126px]"
              variant="blue"
            >
              Tạo mới
            </Button>
          </GrantPermission>
        </CustomSheet.Footer>
      </CustomSheet>
    </>
  );
}
