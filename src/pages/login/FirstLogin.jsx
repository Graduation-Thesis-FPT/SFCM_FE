import { Button } from "@/components/common/ui/button";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  FormLabel
} from "@/components/common/ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/common/ui/tooltip";
import background from "@/assets/image/background-login.png";
import logo from "@/assets/image/Logo_128x128.svg";
import { Eye, EyeOff, Info } from "lucide-react";
import { useCustomToast } from "@/components/common/custom-toast";
import { changeDefaultPassword } from "@/apis/access.api";
import { getRefreshToken, useCustomStore } from "@/lib/auth";
import { useDispatch } from "react-redux";
const formSchema = z.object({
  PASSWORD: z.string().min(5, "Vui lòng nhập mật khẩu!"),
  CONFIRM_PASSWORD: z.string().min(5, "Vui lòng nhập lại mật khẩu tối thiểu 5 ký tự!")
});

export function FirstLogin() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const toast = useCustomToast();
  const userGlobal = useCustomStore();

  const ROWGUID = location?.state?.ROWGUID;
  const USER_NAME = location?.state?.USER_NAME;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { PASSWORD: "", CONFIRM_PASSWORD: "" }
  });

  function onSubmit(values) {
    if (values.PASSWORD !== values.CONFIRM_PASSWORD) {
      form.setError("CONFIRM_PASSWORD", { message: "Mật khẩu nhập lại chưa trùng khớp!" });
      toast.error("Mật khẩu nhập lại chưa trùng khớp!");
      return;
    }

    const userInfo = { USER_NAME: USER_NAME, PASSWORD: values.PASSWORD };

    changeDefaultPassword(ROWGUID, userInfo)
      .then(res => {
        userGlobal.store(res.data.metadata);
        navigate("/");
        toast.success(res);
      })
      .catch(err => {
        toast.error(err);
      });
  }

  useEffect(() => {
    if (!ROWGUID) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    let temp = getRefreshToken();
    if (temp) navigate("/");
  }, []);

  return (
    <div className="grid h-screen grid-cols-8">
      <div className="col-span-3 place-content-center px-[48px]">
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
                    <div className="relative">
                      <Input
                        className="shadow-md focus-visible:ring-offset-0"
                        type={showPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu mới"
                        {...field}
                      />
                      <span
                        onClick={() => {
                          setShowPassword(!showPassword);
                        }}
                        className="absolute inset-y-0 end-0 mr-2 flex cursor-pointer items-center"
                      >
                        {showPassword ? (
                          <Eye size={16} className="bg-white" />
                        ) : (
                          <EyeOff size={16} className="bg-white" />
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

            <FormField
              control={form.control}
              name="CONFIRM_PASSWORD"
              render={({ field }) => {
                return (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-base font-bold">Nhập lại mật khẩu</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          className="shadow-md focus-visible:ring-offset-0"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Nhập lại mật khẩu"
                          {...field}
                        />
                        <span
                          onClick={() => {
                            setShowConfirmPassword(!showConfirmPassword);
                          }}
                          className="absolute inset-y-0 end-0 mr-2 flex cursor-pointer items-center"
                        >
                          {showConfirmPassword ? (
                            <Eye size={16} className="bg-white" />
                          ) : (
                            <EyeOff size={16} className="bg-white" />
                          )}
                        </span>
                      </div>
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
            <Button variant="blue" type="submit" className="w-full">
              Lưu thay đổi
            </Button>
          </form>
        </Form>
      </div>

      <img className="col-span-5 h-screen w-full object-cover" src={background} />
    </div>
  );
}
