import { Button } from "@/components/ui/button";
import React from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
const formSchema = z.object({
  USER_NAME: z.string().min(1, "Vui lòng nhập tài khoản đăng nhập!"),
  PASSWORD: z.string().min(1, "Vui lòng nhập mật khẩu!")
});
export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { USER_NAME: "", PASSWORD: "" }
  });

  function onSubmit(values) {
    if (values.PASSWORD !== "123") {
      form.setError("PASSWORD", {
        message: "Mật khẩu không chính xác!"
      });
      return;
    }
    localStorage.setItem("token", "token");
    navigate("/");
    toast({
      variant: "success",
      title: "Đăng nhập thành công!"
    });
  }
  return (
    <div className="flex h-screen items-center justify-center bg-[url('@/assets/image/background-login.png')] bg-cover bg-center">
      <div className="w-2/3 rounded-md bg-[#dbdada75] p-5 lg:w-1/4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <h1 className="text-center">Đăng nhập</h1>
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
                      placeholder="Tên tài khoản"
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
                      placeholder="Mật khẩu"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage style={{ fontSize: "10px" }} />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Đăng nhập
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
