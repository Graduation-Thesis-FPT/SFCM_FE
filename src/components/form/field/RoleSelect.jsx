import { getAllRole } from "@/apis/role.api";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/spinner";
import useFetchData from "@/hooks/useRefetchData";
import React from "react";

export const RoleSelect = ({ form }) => {
  const { data: roles, loading } = useFetchData({ service: getAllRole });
  if (loading) return <LoadingSpinner />;
  return (
    <FormField
      control={form.control}
      name="ROLE_CODE"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            Chức vụ <span className="text-red">*</span>
          </FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="focus:ring-offset-0">
                <SelectValue placeholder="Chức vụ" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {roles ? (
                roles.map(role => (
                  <SelectItem key={role.ROLE_CODE} value={role.ROLE_CODE}>
                    {role.ROLE_NAME}
                  </SelectItem>
                ))
              ) : (
                <LoadingSpinner />
              )}
            </SelectContent>
          </Select>
          <FormMessage>{form.formState.errors.ROLE_CODE?.message}</FormMessage>
        </FormItem>
      )}
    />
  );
};
