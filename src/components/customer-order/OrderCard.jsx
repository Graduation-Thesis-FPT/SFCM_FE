import { CustomerOrderStatus } from "@/constants/order-status";
import { useToggle } from "@/hooks/useToggle";
import { cn, formatVnd } from "@/lib/utils";
import { ArrowRightToLine, Container, PackageOpen, Printer } from "lucide-react";
import moment from "moment";
import React from "react";
import { useDispatch } from "react-redux";
import { useCustomToast } from "../common/custom-toast";
import { Badge } from "../common/ui/badge";
import { Card, CardContent } from "../common/ui/card";
import { Separator } from "../common/ui/separator";
import { ViewOrderDetail } from "./ViewOrderDetail";
import { Button } from "../common/ui/button";

export function OrderCard({ order, status }) {
  const [expandContainerId, _c, toggleExpandContainerId] = useToggle();
  const [openSheet, setOpen] = useToggle(false);
  const today = new Date();

  const toast = useCustomToast();
  const getColor = status => {
    switch (status) {
      case CustomerOrderStatus.isPending:
        return "border-yellow-100 bg-yellow-50";
      case CustomerOrderStatus.isInProgress:
        return "border-blue-100 bg-blue-50";
      case CustomerOrderStatus.isCompleted:
        return "border-green-100 bg-green-50";
      case CustomerOrderStatus.isCanceled:
        return "border-red-100 bg-red-50";
      default:
        return "border-neutral-100 bg-neutral-50";
    }
  };

  return (
    <>
      <ViewOrderDetail open={openSheet} setOpen={setOpen} paymentInfo={order} />
      <Card className={cn(getColor(status), "min-w-fit")}>
        <CardContent className="flex flex-col gap-2 px-4 py-2">
          <div className="flex flex-row items-center justify-between gap-2">
            <p className="flex flex-row gap-1 text-13">
              <span className="line-clamp-1 font-light">Mã:</span>
              <span className="font-medium text-blue-950">{order.ORDER.ID || "N/A"}</span>
            </p>
            {order?.ORDER_TYPE === "IMPORT" && (
              <Badge className="rounded-sm border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200">
                <ArrowRightToLine className="mr-1" size={16} />
                Nhập
              </Badge>
            )}
            {order?.ORDER_TYPE === "EXPORT" && (
              <Badge className="rounded-sm border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200">
                Xuất
                <ArrowRightToLine className="ml-1" size={16} />
              </Badge>
            )}
          </div>
          <Separator orientation="horizontal" />
          <div className="flex flex-row gap-2">
            {order?.ORDER_TYPE === "IMPORT" && (
              <Container strokeWidth={1} size={40} className="text-blue-600 " />
            )}{" "}
            {order?.ORDER_TYPE === "EXPORT" && (
              <PackageOpen strokeWidth={1} size={40} className="text-blue-600  " />
            )}
            <div className="flex flex-1 flex-col gap-1">
              <div className="flex flex-col text-13">
                <p className="font-light">
                  {order?.ORDER_TYPE === "IMPORT" && "Mã Container:"}
                  {order?.ORDER_TYPE === "EXPORT" && "Mã Package:"}
                </p>
                {Array.isArray(order?.ORDER?.ORDER_DETAILS) &&
                  order?.ORDER?.ORDER_DETAILS.map((item, index) => (
                    <p
                      key={index}
                      className={`flex-1 cursor-pointer pl-2 font-medium text-blue-950 ${expandContainerId ? "" : "line-clamp-1"}`}
                      onClick={() => toggleExpandContainerId()}
                    >
                      {index + 1}. {order?.ORDER_TYPE === "IMPORT" && item.VOYAGE_CONTAINER_ID}
                      {order?.ORDER_TYPE === "EXPORT" && item.VOYAGE_CONTAINER_PACKAGE_ID}
                    </p>
                  ))}
              </div>

              <p className="flex flex-row gap-1 text-13">
                <span className="line-clamp-1 font-light">Tổng tiền:</span>
                <span className="font-medium text-blue-950">
                  {formatVnd(order?.PAYMENT?.TOTAL_AMOUNT ?? 1)}
                </span>
              </p>
            </div>
          </div>
          <div className="mt-2 flex flex-row items-center justify-between gap-2">
            <p className="flex flex-row gap-1 text-12 font-extralight text-gray-700">
              <span>{moment(new Date(order?.ORDER?.CREATED_AT)).format("DD/MM/YYYY")}</span>
            </p>
            <Button
              variant="link"
              size="xs"
              className="text-xs text-blue-700 hover:text-blue-800"
              onClick={() => {
                setOpen(true);
              }}
            >
              Chi tiết
            </Button>
          </div>
          <Separator orientation="horizontal" />
          <div className="flex flex-row items-center justify-between gap-2">
            <div className="flex flex-1 flex-row gap-0.5 text-12">
              <p className="text-nowrap font-light">Số hoá đơn:</p>
              <p className="font-medium text-blue-950">{order?.ORDER?.PAYMENT_ID || "N/A"}</p>
            </div>
            <Printer
              size={16}
              className="mr-1 flex-none cursor-pointer text-blue-600"
              onClick={() => {
                // setPaymentInfo(params.data);
                // setOpenPrint(true);
              }}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
