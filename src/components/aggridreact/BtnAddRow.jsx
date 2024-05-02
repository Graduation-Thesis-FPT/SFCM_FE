import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import { z } from "zod";
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
import { cn } from "@/lib/utils";
const formSchema = z.object({
  number: z.coerce.number().min(1, "Tối thiểu 1 dòng").max(60, "Tối đa 60 dòng")
});
export function BtnAddRow({ addNewRow, ...props }) {
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { number: 1 }
  });

  function onSubmit(values) {
    form.reset();
    setOpen(false);
    addNewRow(values.number);
  }

  return (
    <>
      <Button variant="blue" onClick={() => setOpen(true)} {...props}>
        Thêm dòng
      </Button>
      <Dialog
        open={open}
        onOpenChange={() => {
          setOpen(false);
          form.reset();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nhập số dòng muốn thêm:</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="focus-visible:ring-offset-0"
                        type="number"
                        placeholder="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage style={{ fontSize: "12px" }} />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" variant="primary">
                  Thêm
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
