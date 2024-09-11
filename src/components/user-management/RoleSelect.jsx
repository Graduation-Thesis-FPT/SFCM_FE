import { getAllRole } from "@/apis/role.api";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/common/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/common/ui/select";
import { LoadingSpinner } from "@/components/common/ui/spinner";
import useFetchData from "@/hooks/useRefetchData";
import React from "react";
import { Skeleton } from "../common/ui/skeleton";

export const RoleSelect = ({ form }) => {
  const { data: roles, loading } = useFetchData({ service: getAllRole });
  return (
    <FormField
      control={form.control}
      name="ROLE_ID"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            Chức vụ <span className="text-red">*</span>
          </FormLabel>
          {loading ? (
            <Skeleton className="h-9 w-full" />
          ) : (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="focus:ring-offset-0">
                  <SelectValue placeholder="Chức vụ" />
                </SelectTrigger>
              </FormControl>

              <SelectContent>
                {roles ? (
                  roles.map(role => {
                    if (role.ID === "customer") return null;
                    return (
                      <SelectItem key={role.ID} value={role.ID}>
                        {role.NAME}
                      </SelectItem>
                    );
                  })
                ) : (
                  <LoadingSpinner />
                )}
              </SelectContent>
            </Select>
          )}
          <FormMessage>{form.formState.errors.ROLE_ID?.message}</FormMessage>
        </FormItem>
      )}
    />
  );
};
