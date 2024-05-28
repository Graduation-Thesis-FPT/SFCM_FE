import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { findUserById, resetPasswordById, updateUser } from "@/apis/user.api";
import moment from "moment";
import { useCustomToast } from "@/components/custom-toast";
import { Info, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { GrantPermission } from "@/components/common";
import { actionGrantPermission } from "@/constants";
import { CustomSheet } from "@/components/custom-sheet";

const formSchema = z.object({});

export function DetailWareHouseDesign({ open, onOpenChange, detailData }) {
  const toast = useCustomToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {}
  });

  function onSubmit(values) {
    console.log(123);
  }

  return (
    <CustomSheet open={open} onOpenChange={onOpenChange} title="Cập nhật thông tin dãy">
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
                name="BLOCK"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">
                      Mã dãy <span className="text-red">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="" disabled {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="WAREHOSE_CODE"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">
                      Mã kho <span className="text-red">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="" disabled {...field} />
                    </FormControl>
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
                      <Input type="text" placeholder="" disabled {...field} />
                    </FormControl>
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
                      <Input type="text" placeholder="" disabled {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="d"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">Chiều dài</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="" disabled {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="r"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">Chiều rộng</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="" disabled {...field} />
                    </FormControl>
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
            type="submit"
            form="detail-warehouse-design"
            className="h-12 w-[126px]"
            variant="red"
          >
            Xóa dòng
          </Button>
        </GrantPermission>
      </CustomSheet.Footer>
    </CustomSheet>
  );
}
