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
import { actionGrantPermission } from "@/constants";
import { CustomSheet } from "@/components/custom-sheet";
import { createBlock } from "@/apis/block.api";
import { useDispatch, useSelector } from "react-redux";
import { setGlobalLoading } from "@/redux/slice/globalLoadingSlice";

const formSchema = z.object({
  BLOCK_NAME: z.string().trim().min(1, "Vui lòng nhập mã dãy!"),
  WAREHOUSE_CODE: z.string().min(1, "Vui lòng chọn mã kho!"),
  TIER_COUNT: z.number().positive({ message: "Phải lớn hơn 0!" }),
  SLOT_COUNT: z.number().positive({ message: "Phải lớn hơn 0!" }),
  BLOCK_WIDTH: z.number().positive({ message: "Phải lớn hơn 0!" }),
  BLOCK_HEIGHT: z.number().positive({ message: "Phải lớn hơn 0!" })
});

export function Create({ open, onOpenChange, onCreateData, warehouses }) {
  const dispatch = useDispatch();
  const globalLoading = useSelector(state => state.globalLoadingSlice.globalLoading);

  const toast = useCustomToast();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      BLOCK_NAME: "",
      WAREHOUSE_CODE: "",
      TIER_COUNT: 1,
      SLOT_COUNT: 1,
      BLOCK_HEIGHT: 10,
      BLOCK_WIDTH: 10
    }
  });

  const onSubmit = values => {
    dispatch(setGlobalLoading(true));
    let createData = { insert: [values] };
    createBlock(createData)
      .then(res => {
        let newRow = res.data.metadata.newCreatedBlock;
        onCreateData(newRow);
        form.reset();
        onOpenChange();
        toast.success(res);
      })
      .catch(err => {
        toast.error(err);
      })
      .finally(() => {
        dispatch(setGlobalLoading(false));
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Mã kho" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {warehouses?.map(item => (
                            <SelectItem key={item.WAREHOUSE_CODE} value={item.WAREHOUSE_CODE}>
                              {item.WAREHOUSE_CODE}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                        <Input
                          type="number"
                          placeholder="Số tầng"
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
                  name="SLOT_COUNT"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-600">Số ô</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Số ô"
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
                  name="BLOCK_HEIGHT"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-600">Chiều cao</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Chiều cao"
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
                  name="BLOCK_WIDTH"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-600">Chiều rộng</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Chiều rộng"
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
