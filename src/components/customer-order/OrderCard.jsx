import React from "react";
import { Card, CardContent } from "../common/ui/card";
import { cn } from "@/lib/utils";
import { Separator } from "../common/ui/separator";
import { Badge } from "../common/ui/badge";
import { Container } from "lucide-react";
import { Button } from "../common/ui/button";
import { ExportOrderStatus, ImportOrderStatus } from "@/constants/order-status";
import { DateTimeByTextRender } from "../common/aggridreact/cellRender";
import moment from "moment";

export function OrderCard({ order, status }) {
  const getColor = status => {
    switch (status) {
      case ImportOrderStatus.isConfirmed:
        return "border-green-100 bg-green-50";
      case ImportOrderStatus.isChecked:
        return "border-violet-100 bg-violet-50";
      case ImportOrderStatus.isStored:
        return "border-blue-100 bg-blue-50";
      case ExportOrderStatus.isConfirmed:
        return "border-green-100 bg-green-50";
      case ExportOrderStatus.isReleased:
        return "border-blue-100 bg-blue-50";
      default:
        return "border-red-100 bg-red-50";
    }
  };
  return (
    <Card className={cn(getColor(status), "min-w-fit")}>
      <CardContent className="flex flex-col gap-2 px-4 py-2">
        <div className="flex flex-row items-center justify-between gap-2">
          <p className="flex flex-row gap-1 text-13">
            <span className="line-clamp-1 font-light">Mã:</span>
            <span className="font-medium text-blue-950">{order.DE_ORDER_NO}</span>
          </p>
          <Badge className="rounded-sm border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200">
            Nhập
          </Badge>
        </div>
        <Separator orientation="horizontal" />
        <div className="flex flex-row gap-2">
          <Container strokeWidth={1} size={40} className="text-blue-600 " />
          <div className="flex flex-1 flex-col gap-1">
            <p className="flex flex-row gap-1 text-13">
              <span className="line-clamp-1 font-light">Mã Container:</span>
              <span className="font-medium text-blue-950">{order.CONTAINER_ID}</span>
            </p>
            <p className="flex flex-row gap-1 text-13">
              <span className="line-clamp-1 font-light">Tổng khối lượng:</span>
              <span className="font-medium text-blue-950">{order.TOTAL_CBM}</span>
              <span className="font-light">
                m<sup>3</sup>
              </span>
            </p>
          </div>
        </div>
        <div className="mt-3 flex flex-row items-center justify-between gap-2">
          <p className="flex flex-row gap-1 text-12 font-extralight text-gray-700">
            <span>{moment(order.ISSUE_DATE).format("DD/MM/YYYY")}</span>
            <span>-</span>
            <span>{moment(order.EXP_DATE).format("DD/MM/YYYY")}</span>
          </p>
          <Button variant="blue" size="xs" className="text-[10px] text-white">
            Xem hoá đơn
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
