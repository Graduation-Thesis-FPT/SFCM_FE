import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";

import { useCustomToast } from "@/components/custom-toast";
import { X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

export function DetailPermission({ open, onOpenChange, detailData }) {
  const toast = useCustomToast();
  const accordionRef = useRef(null);

  useEffect(() => {
    console.log(detailData);
  }, [detailData]);

  return (
    <div>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent hiddenIconClose={true} className="sm:max-w-1/2 w-1/2 p-0  ">
          <span className="flex h-screen flex-col justify-between">
            <span>
              <div className="flex items-center justify-between p-6">
                <div className="text-xl font-bold text-gray-900">Phân quyền cho người dùng</div>
                <X
                  className="size-4 cursor-pointer hover:opacity-80"
                  onClick={() => {
                    onOpenChange();
                  }}
                />
              </div>
              <Separator className="bg-gray-400" />

              <div className="space-y-4 p-6">
                <div className="text-lg font-medium text-gray-900">Chức vụ</div>
                <div className="text-base font-bold text-blue-700">{detailData?.ROLE_NAME}</div>
                <div className="pt-4 text-lg font-medium text-gray-900">Phân quyền</div>
              </div>
            </span>
            <span className="flex-1 overflow-y-auto px-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-none">
                  <AccordionTrigger className="justify-normal">
                    <li className="mr-2 text-sm font-bold">Quản lý người dùng</li>
                  </AccordionTrigger>
                  <AccordionContent>
                    <span className="grid grid-cols-6 border-b bg-blue-50 px-2 py-3 text-sm font-medium text-blue-700">
                      <div className="col-span-2">Loại quyền</div>
                      <div className="text-center">Xem</div>
                      <div className="text-center">Thêm</div>
                      <div className="text-center">Sửa</div>
                      <div className="text-center">Xóa</div>
                    </span>
                    <span className="grid grid-cols-6  border-b px-2 py-3 text-sm font-medium text-gray-900">
                      <div className="col-span-2">Loại người dùng</div>
                      <div className="text-center">1</div>
                      <div className="text-center">1</div>
                      <div className="text-center">1</div>
                      <div className="text-center"> 1</div>
                    </span>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </span>

            <span>
              <Separator className="bg-gray-200" />
              <span className="flex items-center justify-end gap-4 p-6">
                <Button className="h-12 w-[126px]" variant="outline">
                  Hủy
                </Button>
                <Button onClick={() => {}} className="h-12 w-[126px]" variant="blue">
                  Lưu thông tin
                </Button>
              </span>
            </span>
          </span>
        </SheetContent>
      </Sheet>
    </div>
  );
}
