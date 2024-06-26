import { findUserById, updateUser } from "@/apis/user.api";
import { useCustomToast } from "@/components/common/custom-toast";
import { Avatar } from "@/components/common/ui/avartar";
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
import { Textarea } from "@/components/common/ui/textarea";
import { regexPattern } from "@/constants/regexPattern";
import useFetchData from "@/hooks/useRefetchData";
import { getFirstLetterOfLastWord } from "@/lib/utils";
import { setUser } from "@/redux/slice/userSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import ChangePassword from "./ChangePassword";

export function ProfilePage() {
  const toast = useCustomToast();
  const userGlobal = useSelector(state => state.userSlice.user);
  const dispatch = useDispatch();
  const { data: user, revalidate } = useFetchData({
    service: findUserById,
    params: { id: userGlobal.userInfo?.ROWGUID },
    dependencies: [userGlobal.userInfo?.ROWGUID],
    shouldFetch: !!userGlobal.userInfo?.ROWGUID
  });

  const formSchema = z.object({
    BIRTHDAY: z.string().refine(
      dateString => {
        const date = moment(dateString);
        const today = moment();
        const age = today.diff(date, "years");
        return dateString === "" || (date.isBefore(today, "day") && age >= 18);
      },
      {
        message: "Ngày sinh không hợp lệ. Bạn phải trên 18 tuổi và ngày sinh không thể là hôm nay."
      }
    ),
    FULLNAME: z.string().trim().min(6, "Tối thiểu 6 ký tự!").regex(regexPattern.NO_SPECIAL_CHAR, {
      message: "Không chứa ký tự đặc biệt!"
    }),
    TELEPHONE: z.string().refine(data => data === "" || data.length === 10, {
      message: "Số điện thoại bao gồm 11 số!"
    }),

    EMAIL: z
      .string()
      .trim()
      .refine(data => data === "" || z.string().email().safeParse(data).success, {
        message: "Email không hợp lệ. Vd:abc@gmail.com"
      }),
    ADDRESS: z
      .string()
      .trim()
      .refine(data => data === "" || data.length <= 500, {
        message: "Địa chỉ không được quá 500 ký tự!"
      }),
    REMARK: z.string().trim().optional()
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    values: {
      ROLE_CODE: user?.ROLE_CODE || "",
      FULLNAME: user?.FULLNAME || "",
      USER_NAME: user?.USER_NAME || "",
      BIRTHDAY: user?.BIRTHDAY ? moment(user?.BIRTHDAY).format("YYYY-MM-DD") : "",
      TELEPHONE: user?.TELEPHONE || "",
      EMAIL: user?.EMAIL || "",
      ADDRESS: user?.ADDRESS || "",
      REMARK: user?.REMARK || ""
    }
  });

  function onSubmit(values) {
    let { USER_NAME, ROLE_CODE, IS_ACTIVE, ...rest } = values;
    updateUser({ id: userGlobal.userInfo?.ROWGUID, data: rest })
      .then(updateRes => {
        form.reset();
        revalidate();
        dispatch(setUser({ ...userGlobal.userInfo, ...rest }));
        toast.success(updateRes);
      })
      .catch(err => {
        toast.error(err);
      });
  }
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-row gap-4">
        <Avatar
          alt="avatar"
          radius="full"
          size="64"
          fallback="S"
          className="h-16 w-16 cursor-pointer items-center justify-center bg-blue-500 text-white"
        >
          {getFirstLetterOfLastWord(user?.FULLNAME)}
        </Avatar>
        <div className="flex flex-col justify-center gap-0.5">
          <div className="text-lg font-bold text-gray-900">{user?.FULLNAME}</div>
          <div className="text-sm font-normal text-gray-600">{user?.ROLE_NAME}</div>
        </div>
      </div>

      <Form {...form}>
        <form
          id="update-user"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-1 flex-col lg:w-3/4"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-x-4">
              <FormField
                control={form.control}
                name="FULLNAME"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ và tên</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Nhập họ và tên" {...field} />
                    </FormControl>
                    <FormMessage>{form.formState.errors.FULLNAME?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="BIRTHDAY"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày sinh</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage>{form.formState.errors.BIRTHDAY?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-x-4">
              <FormField
                control={form.control}
                name="EMAIL"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Nhập email" {...field} />
                    </FormControl>
                    <FormMessage>{form.formState.errors.EMAIL?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="TELEPHONE"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Nhập số điện thoại" {...field} />
                    </FormControl>
                    <FormMessage>{form.formState.errors.TELEPHONE?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="ADDRESS"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Textarea type="text" placeholder="Nhập địa chỉ" {...field} />
                  </FormControl>
                  <FormMessage>{form.formState.errors.ADDRESS?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="REMARK"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl>
                    <Textarea type="text" placeholder="Nhập ghi chú" {...field} />
                  </FormControl>
                  <FormMessage>{form.formState.errors.REMARK?.message}</FormMessage>
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
      <div className="flex flex-row justify-between lg:w-3/4">
        <ChangePassword />
        <Button
          form="update-user"
          disabled={!form.formState.isDirty}
          type="submit"
          className="h-[36px] w-[126px]"
          variant="blue"
        >
          Lưu thông tin
        </Button>
      </div>
    </div>
  );
}
