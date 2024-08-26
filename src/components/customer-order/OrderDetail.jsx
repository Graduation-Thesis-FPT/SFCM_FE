import { OrderStatus } from "@/constants/order-status";
import moment from "moment";
import React, { forwardRef } from "react";
import logo from "@/assets/image/Logo_64x64.svg";

export const OrderDetail = forwardRef(({ data = {}, status }, ref) => {
  return (
    <div ref={ref} className="hidden-to-print space-y-3 p-5">
      <div className="flex justify-between text-sm">
        <div className="flex flex-col items-center">
          <div className="text-center">
            <div>Cảng quốc tế SFCM</div>
            <div>Kho SFCM</div>
          </div>
          <div>
            <img src={logo} className="size-[64px]" />
          </div>
        </div>
        <span className="text-center font-bold">
          <div>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
          <div>ĐỘC LẬP - TỰ DO - HẠNH PHÚC</div>
        </span>
      </div>
      <div className="text-center font-bold">
        <div>
          {status === OrderStatus.Import && "LỆNH NHẬP HÀNG TỪ CONTAINER VÀO KHO"}
          {status === OrderStatus.Export && "LỆNH XUẤT HÀNG RA KHO"}
        </div>
        <div>{/* <i>Kính gửi:....................</i> */}</div>
      </div>
      <div className="text-sm">
        Cảng Quốc Tế SFCM đại diện cho đại lý giao nhận:{" "}
        <span className="font-bold">
          {data?.customerInfo?.CUSTOMER_NAME ?? "...................."}
        </span>
      </div>
      <div className="text-sm">
        {status === OrderStatus.Import &&
          "Đề nghị đội giám sát kho bãi cho chúng tôi được rút hàng vào kho các container hàng chung chủ sau đây vào kho SFCM"}
        {status === OrderStatus.Export &&
          "Đề nghị đội giám sát kho bãi cho chúng tôi được rút hàng ra kho"}
      </div>
      <div className="flex gap-10 text-sm font-bold">
        <div>MÃ LỆNH: {data?.DE_ORDER_NO ?? "...................."}</div>
        <div>SỐ CONT: {data?.containerInfo?.CNTRNO ?? "...................."}</div>
        <div>TỔNG SỐ KHỐI: {data?.TOTAL_CBM ?? "...................."}</div>
        <div>
          HẠN LỆNH:{" "}
          {data?.EXP_DATE ? moment(data.EXP_DATE).format("DD/MM/Y HH:mm") : "...................."}
        </div>
      </div>
      <table className="goods-manifest-table-print">
        <thead>
          <tr>
            <th>STT</th>
            <th>Số House Bill</th>
            <th>Loại hàng</th>
            <th>Số khối</th>
            <th>Ghi chú</th>
          </tr>
        </thead>
        {status === OrderStatus.Import && (
          <tbody>
            {data?.orderDetails?.map((row, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{row.HOUSE_BILL}</td>
                <td>{row.ITEM_TYPE_NAME}</td>
                <td>{row.CBM}</td>
                <td>{row.PK_NOTE}</td>
              </tr>
            ))}
          </tbody>
        )}
        {status === OrderStatus.Export && (
          <tbody>
            {[data?.packageInfo].filter(Boolean).map((row, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{row.HOUSE_BILL}</td>
                <td>{row.ITEM_TYPE_NAME}</td>
                <td>{row.CBM}</td>
                <td>{row.PK_NOTE}</td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
      <div className="flex justify-between text-center text-sm">
        <span>
          <div>
            {status === OrderStatus.Import &&
              "Chúng tôi hoàn toàn chịu trách nhiệm về hàng hóa sau khi đã nhập kho"}
            {status === OrderStatus.Export &&
              "Chúng tôi hoàn toàn chịu trách nhiệm về hàng hóa sau khi đã xuất kho"}
          </div>
          <div className="mt-3 font-bold">Hải quan giám sát kho bãi</div>
        </span>
        <span>
          <div>
            TP.HCM Ngày {moment().format("DD")} Tháng {moment().format("MM")} Năm{" "}
            {moment().format("Y")}
          </div>
          <div className="mt-3 font-bold">Cảng Quốc Tế SFCM</div>
          <div className="mt-20">Nhân viên thủ tục</div>
        </span>
      </div>
    </div>
  );
});
