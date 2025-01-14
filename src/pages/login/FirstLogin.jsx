import { changeDefaultPassword } from "@/apis/access.api";
import background from "@/assets/image/background-login.png";
import logo from "@/assets/image/Logo_128x128.svg";
import { useCustomToast } from "@/components/common/custom-toast";
import { Button } from "@/components/common/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel
} from "@/components/common/ui/form";
import { Password } from "@/components/common/ui/password";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/common/ui/tooltip";
import { useToggle } from "@/hooks/useToggle";
import { getRefreshToken, useCustomStore } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";

const formSchema = z
  .object({
    PASSWORD: z.string().min(5, "Vui lòng nhập mật khẩu!"),
    CONFIRM_PASSWORD: z.string().min(5, "Vui lòng nhập lại mật khẩu tối thiểu 5 ký tự!")
  })
  .refine(data => data.PASSWORD === data.CONFIRM_PASSWORD, {
    message: "Mật khẩu xác nhận không khớp!",
    path: ["CONFIRM_PASSWORD"]
  });

export function FirstLogin() {
  const location = useLocation();
  const navigate = useNavigate();
  const [btnLoading, setBtnLoading] = useToggle();
  const toast = useCustomToast();
  const userGlobal = useCustomStore();

  const USERNAME = location?.state?.USERNAME;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { PASSWORD: "", CONFIRM_PASSWORD: "" }
  });

  function onSubmit(values) {
    setBtnLoading(true);
    const userInfo = { USERNAME: USERNAME, PASSWORD: values.PASSWORD };
    changeDefaultPassword(USERNAME, userInfo)
      .then(res => {
        userGlobal.store(res.data.metadata);
        navigate("/");
        toast.success(res);
      })
      .catch(err => {
        toast.error(err);
      });
    setBtnLoading(false);
  }

  useEffect(() => {
    if (!USERNAME) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    let temp = getRefreshToken();
    if (temp) navigate("/");
  }, []);

  return (
    <div className="grid h-screen grid-cols-8">
      <div className="col-span-8 place-content-center px-[48px] md:col-span-3">
        <img className="m-auto mb-[42px]" src={logo} />
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <h1 className="mb-8 text-center text-3xl font-bold text-blue-800">
              Thay đổi mật khẩu mặc định
            </h1>

            <FormField
              control={form.control}
              name="PASSWORD"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-base font-bold">Mật khẩu mới</FormLabel>
                  <FormControl>
                    <Password
                      {...field}
                      placeholder="Nhập mật khẩu mới"
                      className="shadow-md focus-visible:ring-offset-0"
                      autoComplete="current-password"
                    />
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

            <FormField
              control={form.control}
              name="CONFIRM_PASSWORD"
              render={({ field }) => {
                return (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-base font-bold">Nhập lại mật khẩu</FormLabel>
                    <FormControl>
                      <Password
                        {...field}
                        placeholder="Nhập lại mật khẩu"
                        className="shadow-md focus-visible:ring-offset-0"
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <FormDescription className="flex text-xs font-light">
                      {form.formState.errors.CONFIRM_PASSWORD?.message ? (
                        <span className="text-red-500">
                          {form.formState.errors.CONFIRM_PASSWORD?.message}
                        </span>
                      ) : (
                        "Nhập mật khẩu của bạn"
                      )}
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
                );
              }}
            />
            <Button loading={btnLoading} variant="blue" type="submit" className="w-full">
              Lưu thay đổi
            </Button>
          </form>
        </Form>
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
