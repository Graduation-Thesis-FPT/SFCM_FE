import moment from "moment";
import { forwardRef } from "react";
import { useSelector } from "react-redux";

export const ComponentPrintExOrder = forwardRef(
  ({ data = {}, selectedCustomer = {}, packageFilter = {}, selectedContainer = {} }, ref) => {
    const user = useSelector(state => state.userSlice.user);
    return (
      <div ref={ref} className="hidden-to-print space-y-3 p-5">
        <div className="flex justify-between text-sm">
          <span>
            <div>Cảng quốc tế SFCM</div>
            <div>Kho SFCM</div>
          </span>
          <span className="text-center font-bold">
            <div>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
            <div>ĐỘC LẬP - TỰ DO - HẠNH PHÚC</div>
          </span>
        </div>
        <div className="text-center font-bold">
          <div>LỆNH XUẤT HÀNG RA KHO</div>
          <div>{/* <i>Kính gửi:....................</i> */}</div>
        </div>
        <div className="text-sm">
          Cảng Quốc Tế SFCM đại diện cho đại lý giao nhận:{" "}
          <span className="font-bold">
            {selectedCustomer?.CUSTOMER_NAME ?? "...................."}
          </span>
        </div>
        <div className="text-sm">
          Đề nghị đội giám sát kho bãi cho chúng tôi được rút hàng ra kho
        </div>
        <div className="flex gap-10 text-sm font-bold">
          <div>MÃ LỆNH: {data?.neworder?.DE_ORDER_NO ?? "...................."}</div>
          <div>SỐ CONT: {selectedContainer?.CNTRNO ?? "...................."}</div>
          <div>TỔNG SỐ KHỐI: {data.neworder?.TOTAL_CBM ?? "...................."}</div>
          <div>
            HẠN LỆNH:{" "}
            {data?.neworder?.EXP_DATE
              ? moment(data.neworder.EXP_DATE).format("DD/MM/Y HH:mm")
              : "...................."}
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
          <tbody>
            {data?.neworderDtl?.map((row, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{row.HOUSE_BILL}</td>
                <td>{row.ITEM_TYPE_NAME}</td>
                <td>{row.CBM}</td>
                <td>{row.PK_NOTE}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between text-center text-sm">
          <span>
            <div>Chúng tôi hoàn toàn chịu trách nhiệm về hàng hóa sau khi đã xuất kho</div>
            <div className="mt-3 font-bold">Hải quan giám sát kho bãi</div>
          </span>
          <span>
            <div>
              TP.HCM Ngày {moment().format("DD")} Tháng {moment().format("MM")} Năm{" "}
              {moment().format("Y")}
            </div>
            <div className="mt-3 font-bold">Cảng Quốc Tế SFCM</div>
            <div className="mt-20">{user?.userInfo?.FULLNAME}</div>
          </span>
        </div>
      </div>
    );
  }
);
