import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  ROLE_CODE: z.string({
    required_error: "Không được để trống!"
  }),
  USER_NAME: z.string().trim().min(6, "Tối thiểu 6 ký tự!"),
  BIRTHDAY: z.string().optional(),
  FULLNAME: z.string().refine(data => data === "" || data.length >= 6, {
    message: "Tối thiểu 6 ký tự!"
  }),
  TELEPHONE: z.string().refine(data => data === "" || data.length === 10, {
    message: "Số điện thoại bao gồm 11 số!"
  }),
  EMAIL: z.string().refine(data => data === "" || z.string().email().safeParse(data).success, {
    message: "Email không hợp lệ. Vd:abc@gmail.com"
  }),
  ADDRESS: z.string().optional(),
  REMARK: z.string().optional()
});

export function VesselInfo() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {}
  });

  const onSubmit = data => {};
  return (
    <Section>
      <Section.Header>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="USER_NAME"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên tài khoản</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Nhập tài khoản" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button variant="blue" type="submit">
              Nạp dữ liệu
            </Button>
          </form>
        </Form>
      </Section.Header>
      <Section.Content></Section.Content>
    </Section>
  );
}
