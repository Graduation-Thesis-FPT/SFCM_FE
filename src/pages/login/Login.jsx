import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import background from "@/assets/image/background-login.png";
import logo from "@/assets/image/Logo_128x128.svg";
import { Eye, EyeOff, Info } from "lucide-react";
import ForgotPassword from "./ForgotPassword";
import { useCustomToast } from "@/components/custom-toast";
import { login } from "@/apis/access.api";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slice/userSlice";
import { storeAccessToken, storeRefreshToken } from "@/lib/auth";

const formSchema = z.object({
  USER_NAME: z.string().min(5, "Vui lòng nhập tài khoản đăng nhập!"),
  PASSWORD: z.string().min(5, "Vui lòng nhập mật khẩu!")
});

const fakeLoginData = { USER_NAME: "admin", PASSWORD: "12345" };

export function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const toast = useCustomToast();
  const dispatch = useDispatch();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { USER_NAME: "", PASSWORD: "" }
  });

  function onSubmit(values) {
    login(values)
      .then(res => {
        if (res.data.metadata.changeDefaultPassword) {
          navigate("/change-default-password", {
            state: { ROWGUID: res.data.metadata.ROWGUID, USER_NAME: values.USER_NAME }
          });
          toast.success("Đăng nhập thành công! Vui lòng đổi mật khẩu mặc định!");
          return;
        }
        navigate("/");
        dispatch(setUser(res.data.metadata));
        storeAccessToken(res.data.metadata.accessToken);
        storeRefreshToken(res.data.metadata.refreshToken);
        toast.success(res.data.message);
      })
      .catch(err => {
        toast.error(err.response.data.message || err.message);
      });
    return;
  }

  return (
    <div className=" grid h-screen grid-cols-8 align-middle">
      <div className="col-span-3 place-content-center px-[48px]">
        <img className="m-auto mb-[42px]" src={logo} />
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <h1 className="mb-8 text-5xl font-bold text-blue-800">Đăng nhập</h1>
            <FormField
              control={form.control}
              name="USER_NAME"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-bold">Tài khoản</FormLabel>
                  <FormControl>
                    <Input
                      className="shadow-md focus-visible:ring-offset-0"
                      type="text"
                      placeholder="Nhập tài khoản"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="flex text-xs font-light">
                    Nhập tài khoản của bạn
                    <TooltipProvider delayDuration={500}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="ml-1 h-4 w-4 text-blue-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Tài khoản phải tối thiểu 5 ký tự</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="PASSWORD"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-bold">Mật khẩu</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className="shadow-md focus-visible:ring-offset-0"
                        type={showPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu"
                        {...field}
                      />
                      <span
                        onClick={() => {
                          setShowPassword(!showPassword);
                        }}
                        className="absolute inset-y-0 end-0 mr-2 flex cursor-pointer items-center"
                      >
                        {showPassword ? (
                          <Eye className="size-6 bg-white" />
                        ) : (
                          <EyeOff className="size-6 bg-white" />
                        )}
                      </span>
                    </div>
                  </FormControl>
                  <FormDescription className="flex text-xs font-light">
                    Nhập mật khẩu của bạn
                    <TooltipProvider delayDuration={500}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="ml-1 h-4 w-4 text-blue-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Mật khẩu phải tối thiểu 5 ký tự</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormDescription>
                </FormItem>
              )}
            />
            <ForgotPassword />
            <Button
              type="submit"
              className="w-full bg-blue-600 text-base font-bold hover:bg-blue-600/80"
            >
              Đăng nhập
            </Button>
          </form>
        </Form>
      </div>

      <img className="col-span-5 h-screen w-full object-cover" src={background} />
    </div>
  );
}
