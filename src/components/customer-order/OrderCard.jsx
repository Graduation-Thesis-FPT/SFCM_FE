import { viewInvoice } from "@/apis/order.api";
import { ExportOrderStatus, ImportOrderStatus, OrderStatus } from "@/constants/order-status";
import { useToggle } from "@/hooks/useToggle";
import { cn, getType } from "@/lib/utils";
import { setGlobalLoading } from "@/redux/slice/globalLoadingSlice";
import { ArrowRightToLine, Container, PackageOpen, Printer } from "lucide-react";
import moment from "moment";
import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { useCustomToast } from "../common/custom-toast";
import { Badge } from "../common/ui/badge";
import { Button } from "../common/ui/button";
import { Card, CardContent } from "../common/ui/card";
import { Separator } from "../common/ui/separator";
import { OrderDetail } from "./OrderDetail";
import { useReactToPrint } from "react-to-print";

export function OrderCard({ order, status }) {
  const orderDetailRef = useRef();
  const [expandContainerId, _c, toggleExpandContainerId] = useToggle();
  const [expandPackageId, _p, toggleExpandPackageId] = useToggle();
  const dispatch = useDispatch();
  const today = new Date();
  const checkOverEpireDate = date => {
    return new Date(date) < today;
  };
  const toast = useCustomToast();
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
      case ExportOrderStatus.isCanceled:
        return "border-red-100 bg-red-50";
      case ImportOrderStatus.isCanceled:
        return "border-red-100 bg-red-50";
      default:
        return "border-red-100 bg-red-50";
    }
  };

  const handlePrint = useReactToPrint({
    content: () => orderDetailRef.current,
    onBeforePrint: () => dispatch(setGlobalLoading(true)),
    onAfterPrint: () => dispatch(setGlobalLoading(false))
  });

  const handleViewInvoice = async deliveryOrderNO => {
    dispatch(setGlobalLoading(true));
    await viewInvoice(deliveryOrderNO)
      .then(res => {
        let base64Data = res.data.metadata.content.data;
        const blob = new Blob([new Uint8Array(base64Data).buffer], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank");
      })
      .catch(err => {
        toast.error(err);
      })
      .finally(() => {
        dispatch(setGlobalLoading(false));
      });
  };
  return (
    <>
      <Card className={cn(getColor(status), "min-w-fit")}>
        <CardContent className="flex flex-col gap-2 px-4 py-2">
          <div className="flex flex-row items-center justify-between gap-2">
            <p className="flex flex-row gap-1 text-13">
              <span className="line-clamp-1 font-light">Mã:</span>
              <span className="font-medium text-blue-950">{order.DE_ORDER_NO || "N/A"}</span>
            </p>
            {getType(order) === OrderStatus.Import ? (
              <Badge className="rounded-sm border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200">
                <ArrowRightToLine className="mr-1" size={16} />
                Nhập
              </Badge>
            ) : (
              <Badge className="rounded-sm border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200">
                Xuất
                <ArrowRightToLine className="ml-1" size={16} />
              </Badge>
            )}
          </div>
          <Separator orientation="horizontal" />
          <div className="flex flex-row gap-2">
            {getType(order) === OrderStatus.Import ? (
              <Container strokeWidth={1} size={40} className="text-blue-600 " />
            ) : (
              <PackageOpen strokeWidth={1} size={40} className="text-blue-600  " />
            )}
            <div className="flex flex-1 flex-col gap-1">
              <div className="flex flex-row gap-0.5 text-13">
                <p className="font-light">Mã container:</p>
                <p
                  className={`flex-1 cursor-pointer  font-medium text-blue-950 ${expandContainerId ? "" : "line-clamp-1"}`}
                  onClick={() => toggleExpandContainerId()}
                >
                  {order.containerInfo.CNTRNO || "N/A"}
                </p>
              </div>
              {getType(order) === OrderStatus.Export && (
                <div className="flex flex-row gap-0.5 text-13">
                  <p className="font-light">Mã lô hàng:</p>
                  <p
                    className={`flex-1 cursor-pointer  font-medium text-blue-950 ${expandPackageId ? "" : "line-clamp-1"}`}
                    onClick={() => toggleExpandPackageId()}
                  >
                    {order.packageInfo.HOUSE_BILL || "N/A"}
                  </p>
                </div>
              )}
              <p className="flex flex-row gap-1 text-13">
                <span className="line-clamp-1 font-light">Tổng khối lượng:</span>
                <span className="font-medium text-blue-950">{order.TOTAL_CBM || "N/A"}</span>
                <span className="font-light">
                  m<sup>3</sup>
                </span>
              </p>
            </div>
          </div>
          <div className="mt-2 flex flex-row items-center justify-between gap-2">
            <p className="flex flex-row gap-1 text-12 font-extralight text-gray-700">
              <span>{moment(order.ISSUE_DATE).format("DD/MM/YYYY")}</span>
              <span>-</span>
              <span className={checkOverEpireDate(order.EXP_DATE) ? "text-red-500" : ""}>
                {moment(order.EXP_DATE).format("DD/MM/YYYY")}
              </span>
            </p>
            <Button variant="ghost" size="xs" className="text-xs" onClick={() => handlePrint()}>
              <Printer size={16} className="mr-1 text-blue-950" />
              In phiếu
            </Button>
          </div>
          <Separator orientation="horizontal" />
          <div className="flex flex-row items-center justify-between gap-2">
            <div className="flex flex-1 flex-row gap-0.5 text-12">
              <p className="text-nowrap font-light">Số hoá đơn:</p>
              <p className="font-medium text-blue-950">{order.INV_ID || "N/A"}</p>
            </div>
            <Button
              variant="blue"
              size="xs"
              className="text-[10px] text-white"
              onClick={() => {
                handleViewInvoice(order.DE_ORDER_NO);
              }}
            >
              Xem hoá đơn
            </Button>
          </div>
        </CardContent>
      </Card>
      <OrderDetail ref={orderDetailRef} data={order} status={getType(order)} />
    </>
  );
}
