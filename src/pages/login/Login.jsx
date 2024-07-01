import { Button } from "@/components/common/ui/button";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/common/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/common/ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/common/ui/tooltip";
import background from "@/assets/image/background-login.svg";
import logo from "@/assets/image/Logo_128x128.svg";
import { Eye, EyeOff, Info } from "lucide-react";
import ForgotPassword from "./ForgotPassword";
import { useCustomToast } from "@/components/common/custom-toast";
import { login } from "@/apis/access.api";
import { getRefreshToken, useCustomStore } from "@/lib/auth";
import { regexPattern } from "@/constants/regexPattern";

const formSchema = z.object({
  USER_NAME: z
    .string()
    .min(1, { message: "Vui lòng nhập tài khoản!" }) // Non-empty
    .max(20, { message: "Tài khoản không được vượt quá 20 ký tự!" }) // Max length 20
    .regex(regexPattern.NO_SPACE, { message: "Tài khoản không được chứa khoảng trắng!" }), // No spaces
  PASSWORD: z
    .string()
    .min(1, { message: "Vui lòng nhập mật khẩu!" })
    .regex(regexPattern.NO_SPACE, { message: "Tài khoản không được chứa khoảng trắng!" }) // No spaces
});

export function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const toast = useCustomToast();
  const userGlobal = useCustomStore();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { USER_NAME: "", PASSWORD: "" }
  });

  function onSubmit(values) {
    login(values)
      .then(res => {
        if (res.data.metadata.changeDefaultPassword) {
          navigate("/change-default-password", {
            state: {
              ROWGUID: res.data.metadata.ROWGUID,
              USER_NAME: values.USER_NAME
            }
          });
          toast.success("Đăng nhập thành công! Vui lòng đổi mật khẩu mặc định!");
          return;
        }
        userGlobal.store(res.data.metadata);
        toast.success(res);
        navigate("/");
      })
      .catch(err => {
        toast.error(err);
      });
    return;
  }

  useEffect(() => {
    let temp = getRefreshToken();
    if (temp) navigate("/");
  }, []);

  return (
    <div className="grid h-screen grid-cols-8 align-middle">
      <div className="col-span-8 flex h-full flex-col items-center justify-center gap-y-12 overflow-auto p-10 md:col-span-3 lg:p-16">
        <img alt="logo" className="h-32 w-32" src={logo} />
        <div className="flex w-full max-w-96 flex-col gap-y-4">
          <Form {...form}>
            <form
              id="loginForm"
              className="w-full space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <h1 className="mb-8 text-3xl font-bold text-blue-800 lg:text-4xl">Đăng nhập</h1>
              <FormField
                control={form.control}
                name="USER_NAME"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-base">Tài khoản</FormLabel>
                    <FormControl>
                      <Input
                        className="shadow-md focus-visible:ring-offset-0"
                        type="text"
                        placeholder="Nhập tài khoản"
                        autoComplete="on"
                        {...field}
                      />
                    </FormControl>
                    <div className="flex flex-row gap-1">
                      <FormDescription className="flex text-xs font-light">
                        Nhập tài khoản của bạn
                      </FormDescription>
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger>
                            <Info className="ml-1 h-4 w-4 text-blue-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Tài khoản phải tối thiểu 5 ký tự</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="PASSWORD"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-base">Mật khẩu</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          className="shadow-md focus-visible:ring-offset-0"
                          type={showPassword ? "text" : "password"}
                          placeholder="Nhập mật khẩu"
                          {...field}
                          autoComplete="on"
                        />
                        <button
                          onClick={() => {
                            setShowPassword(!showPassword);
                          }}
                          className="absolute inset-y-0 end-0 mr-2 flex cursor-pointer items-center"
                        >
                          {showPassword ? (
                            <Eye className="size-4 bg-white" />
                          ) : (
                            <EyeOff className="size-4 bg-white" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <div className="flex flex-row gap-1">
                      <FormDescription className="flex text-xs font-light">
                        Nhập mật khẩu của bạn
                      </FormDescription>
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger>
                            <Info className="ml-1 h-4 w-4 text-blue-500" />
                          </TooltipTrigger>
                          <TooltipContent>Mật khẩu phải tối thiểu 5 ký tự</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <div className="flex w-full items-center justify-end">
            <ForgotPassword />
          </div>
          <Button variant="blue" type="submit" form="loginForm" className="w-full">
            Đăng nhập
          </Button>
        </div>
      </div>

      <img
        loading="lazy"
        alt="backgound-login"
        className="hidden h-screen w-full object-cover md:col-span-5 md:flex"
        src={background}
      />
    </div>
  );
}
