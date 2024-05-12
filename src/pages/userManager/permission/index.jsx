import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";
import React from "react";

export function Permission() {
  return (
    <>
      <Section>
        <div className="text-2xl font-bold text-gray-900">Phân quyền người dùng</div>
      </Section>
      <Separator />
      <Section>
        <div className="my-2 text-xs  font-medium ">Tìm kiếm</div>
        <div className="relative mb-6 flex">
          <Search className="absolute left-2.5 top-2.5 size-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Nhập từ khóa..."
            className="mr-4 w-[416px] pl-8 text-black"
          />
          <Button>
            Tìm kiếm
            <Search className="ml-2 size-5" />
          </Button>
        </div>
      </Section>
    </>
  );
}
