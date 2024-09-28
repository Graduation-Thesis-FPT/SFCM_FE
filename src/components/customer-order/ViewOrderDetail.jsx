import { formatVnd } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";
import React from "react";
import { useForm } from "react-hook-form";
import { CustomSheet } from "../common/custom-sheet";
import { useCustomToast } from "../common/custom-toast";
import { Badge } from "../common/ui/badge";
import { Button } from "../common/ui/button";
import { Label } from "../common/ui/label";
import { Separator } from "../common/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

export function ViewOrderDetail({ paymentInfo, open, setOpen }) {
  const form = useForm({
    resolver: zodResolver()
  });
  const toast = useCustomToast();

  return (
    <CustomSheet
      open={open}
      onOpenChange={() => {
        setOpen(false);
      }}
      title="Thông tin đơn hàng"
    >
      <div className="flex flex-1 flex-col  overflow-y-auto">
        <CustomSheet.Content>
          <div className="h-fit space-y-4">
            <Label className="text-sm font-medium">Thông tin đơn hàng</Label>
            <Table className="border text-xs">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-nowrap">STT</TableHead>
                  <TableHead className="text-nowrap">Tên hàng hóa, dịch vụ</TableHead>
                  <TableHead className="text-nowrap">Đơn vị tính</TableHead>
                  <TableHead className="text-nowrap">
                    {paymentInfo?.ORDER_TYPE === "EXPORT" ? "Số khối" : "Kích thước"}
                  </TableHead>
                  {paymentInfo?.ORDER_TYPE === "EXPORT" && (
                    <TableHead className="text-nowrap">Số ngày</TableHead>
                  )}
                  <TableHead className="text-nowrap">Đơn giá</TableHead>
                  <TableHead className="text-nowrap">Thuế</TableHead>
                  <TableHead className="text-nowrap">Thành tiền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentInfo?.ORDER_TYPE === "IMPORT" &&
                  paymentInfo?.ORDER?.ORDER_DETAILS?.map((item, index) => (
                    <TableRow className="data" key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.VOYAGE_CONTAINER_ID ?? "N/A"}</TableCell>
                      <TableCell>feet</TableCell>
                      <TableCell>{item.CNTR_SIZE ?? 1}ft</TableCell>
                      <TableCell>{formatVnd(item.UNIT_PRICE ?? 1000)}</TableCell>
                      <TableCell>{item.VAT_RATE ?? 1}%</TableCell>
                      <TableCell>{formatVnd(item.TOTAL_AMOUNT ?? 1000)}</TableCell>
                    </TableRow>
                  ))}
                {paymentInfo?.ORDER_TYPE === "EXPORT" &&
                  paymentInfo?.ORDER?.ORDER_DETAILS?.map((item, index) => (
                    <TableRow className="data" key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.VOYAGE_CONTAINER_PACKAGE_ID ?? "N/A"}</TableCell>
                      <TableCell>Khối/ngày</TableCell>
                      <TableCell>{item.CBM ?? 1}</TableCell>
                      <TableCell>{item.TOTAL_DAYS ?? 1}</TableCell>

                      <TableCell>{formatVnd(item.UNIT_PRICE ?? 1)}</TableCell>
                      <TableCell>{item.VAT_RATE ?? 1}%</TableCell>
                      <TableCell>{formatVnd(item.TOTAL_AMOUNT ?? 1)}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Thông tin thanh toán</Label>
              <Separator />
              <div className="grid grid-cols-2 gap-y-2 font-semibold">
                <p className="text-14 font-semibold">Tổng tiền trước thuế</p>
                <p className="text-end text-14">
                  {formatVnd(paymentInfo?.PAYMENT?.PRE_VAT_AMOUNT ?? 1)}
                </p>
                <p className="text-14 font-semibold">Tổng tiền thuế</p>
                <p className="text-end text-14">
                  {formatVnd(paymentInfo?.PAYMENT?.VAT_AMOUNT ?? 1)}
                </p>
                <p className="text-14 font-semibold ">Thành tiền</p>
                <p className="text-end text-16 text-blue-800">
                  {formatVnd(paymentInfo?.PAYMENT?.TOTAL_AMOUNT) ?? 1}
                </p>
                <p className="text-14 font-semibold">Trạng thái thanh toán</p>
                <div className="flex w-full justify-end">
                  {paymentInfo?.PAYMENT?.STATUS === "PAID" && (
                    <Badge className="rounded-sm border-transparent bg-green-100 font-normal text-green-800 hover:bg-green-200">
                      Đã thanh toán
                    </Badge>
                  )}
                  {paymentInfo?.PAYMENT?.STATUS === "PENDING" && (
                    <Badge className="rounded-sm border-transparent  bg-yellow-100 font-normal text-yellow-800 hover:bg-yellow-200">
                      Chờ thanh toán
                    </Badge>
                  )}
                  {paymentInfo?.PAYMENT?.STATUS === "CANCELLED" && (
                    <Badge className="rounded-sm border-transparent bg-red-100 font-normal text-red-800 hover:bg-red-200">
                      Đã hủy
                    </Badge>
                  )}
                </div>
                {paymentInfo?.PAYMENT?.STATUS === "CANCELLED" && (
                  <>
                    <p className="text-14 font-semibold">Lý do hủy</p>
                    <p className="text-end text-14 font-normal">
                      {paymentInfo?.PAYMENT?.CANCEL_REMARK} - (
                      {moment(paymentInfo?.PAYMENT?.CANCEL_DATE).format("DD/MM/YYYY")})
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Thông tin khách hàng</Label>

              <Separator />
              <div className="grid grid-cols-1 gap-x-2 gap-y-2 rounded bg-neutral-100 p-2 text-14">
                <p>
                  <strong className="space-x-2">Mã số thuế:</strong>{" "}
                  {paymentInfo?.ORDER?.USER?.TAX_CODE}
                </p>
                <p>
                  <strong className="space-x-2">Tên chủ hàng:</strong>
                  {paymentInfo?.ORDER?.USER?.FULLNAME}
                </p>
                <p>
                  <strong className="space-x-2">Địa chỉ:</strong>{" "}
                  {paymentInfo?.ORDER?.USER?.ADDRESS}
                </p>
                <p>
                  <strong className="space-x-2">Email:</strong> {paymentInfo?.ORDER?.USER?.EMAIL}
                </p>
                {paymentInfo?.ORDER_TYPE === "EXPORT" && (
                  <p>
                    <strong className="space-x-2">Ngày lấy hàng:</strong>{" "}
                    {moment(paymentInfo?.ORDER?.PICKUP_DATE ?? new Date()).format("DD/MM/YYYY")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CustomSheet.Content>
        <CustomSheet.Footer className="flex justify-end bg-white px-6 py-4">
          <Button
            onClick={() => {
              setOpen(false);
              form.reset();
            }}
            className="mr-3 h-[36px] w-[126px] text-blue-600 hover:text-blue-600"
            variant="outline"
            type="button"
          >
            Đóng
          </Button>
        </CustomSheet.Footer>
      </div>
    </CustomSheet>
  );
}
