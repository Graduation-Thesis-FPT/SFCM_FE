import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
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
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  USER_GROUP_CODE: z.string({
    required_error: "Không được để trống!"
  }),
  USER_NAME: z.string().trim().min(6, "Tối thiểu 6 ký tự!"),
  PASSWORD: z.string().trim().min(6, "Tối thiểu 6 ký tự và hông chứa khoảng trắng!"),
  BIRTHDAY: z.string().optional(),
  TELPHONE: z.string().refine(data => data === "" || data.length === 11, {
    message: "Số điện thoại bao gồm 11 số!"
  }),
  EMAIL: z.string().refine(data => data === "" || z.string().email().safeParse(data).success, {
    message: "Email không hợp lệ. Vd:abc@gmail.com"
  }),
  ADDRESS: z.string().optional()
});

export function FormCreateAccount({ open, setOpen, ...props }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      USER_GROUP_CODE: "user",
      USER_NAME: "",
      PASSWORD: "",
      BIRTHDAY: "",
      TELPHONE: "",
      EMAIL: "",
      ADDRESS: ""
    }
  });

  function onSubmit(values) {
    console.log("🚀 ~ onSubmit ~ values:", values);
    form.reset();
    setOpen(false);
  }
  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        form.reset();
        setOpen(false);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thông tin tài khoản:</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="USER_GROUP_CODE"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nhóm người dùng:</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="focus:ring-offset-0">
                        <SelectValue placeholder="Nhóm người dùng" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="manage">Manage</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage style={{ fontSize: "10px" }} />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-x-4">
              <FormField
                control={form.control}
                name="USER_NAME"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên tài khoản:</FormLabel>
                    <FormControl>
                      <Input
                        className="focus-visible:ring-offset-0"
                        type="text"
                        placeholder="Vd: abc123"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage style={{ fontSize: "10px" }} />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="PASSWORD"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu:</FormLabel>
                    <FormControl>
                      <Input
                        className="focus-visible:ring-offset-0"
                        type="password"
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage style={{ fontSize: "10px" }} />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-x-4">
              <FormField
                control={form.control}
                name="BIRTHDAY"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày sinh:</FormLabel>
                    <FormControl>
                      <Input className="focus-visible:ring-offset-0" type="date" {...field} />
                    </FormControl>
                    <FormMessage style={{ fontSize: "10px" }} />
                  </FormItem>
                )}
              />
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="TELPHONE"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input
                          className="focus-visible:ring-offset-0"
                          type="number"
                          placeholder="Vd: 0919123456"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage style={{ fontSize: "10px" }} />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="EMAIL"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email:</FormLabel>
                  <FormControl>
                    <Input
                      className="focus-visible:ring-offset-0"
                      type="text"
                      placeholder="Vd: abc@gmail.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage style={{ fontSize: "10px" }} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ADDRESS"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ:</FormLabel>
                  <FormControl>
                    <Input
                      className="focus-visible:ring-offset-0"
                      type="text"
                      placeholder="Vd: 123 Đường ABC, Quận XYZ, TP HCM"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage style={{ fontSize: "10px" }} />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" variant="blue">
                Tạo
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
