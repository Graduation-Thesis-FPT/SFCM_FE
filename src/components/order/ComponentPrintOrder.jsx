import moment from "moment";
import { forwardRef } from "react";
import { useSelector } from "react-redux";
import logo from "@/assets/image/Logo_64x64.svg";
import { Separator } from "../common/ui/separator";
import { cn } from "@/lib/utils";

export const ComponentPrintOrder = forwardRef(
  (
    { header = {}, detail = [], type = "XK", className, hiddenToPrint = true, statusOrder },
    ref
  ) => {
    const user = useSelector(state => state.userSlice.user);
    return (
      <div
        ref={ref}
        className={cn(
          hiddenToPrint ? "hidden-to-print" : "",
          "relative min-h-[100vh] space-y-3 p-10",
          className
        )}
      >
        <div className="flex items-center space-x-4">
          <img src={logo} className="size-[110px]" />
          <div className="w-full">
            <span>
              <div className="text-center">
                <div>CÔNG TY TNHH CẢNG QUỐC TẾ SFCM</div>
                <div>KHO SFCM</div>
              </div>
              <Separator className="my-2" />
              <div className="text-center">
                {type === "XK" ? (
                  <div className="text-32 font-bold">LỆNH XUẤT HÀNG RA KHO</div>
                ) : (
                  <div className="text-32 font-bold">LỆNH NHẬP HÀNG VÀO KHO</div>
                )}
                <div className="">
                  Ngày {moment().format("DD")} Tháng {moment().format("MM")} Năm{" "}
                  {moment().format("Y")}
                </div>
              </div>
            </span>
          </div>
        </div>
        <div className="flex justify-between font-bold">
          <div>Mã lệnh: {header?.ID ?? "...................."}</div>
          <div>Mã hóa đơn: {header?.PAYMENT_ID ?? "...................."}</div>
        </div>
        <div className="">
          Cảng Quốc Tế SFCM đại diện cho đại lý:{" "}
          <span className="font-bold">{header?.FULLNAME ?? "...................."}</span>
        </div>
        {type === "XK" ? (
          <div className="">
            Đề nghị đội giám sát kho bãi cho chúng tôi được xuất các kiện hàng chung chủ sau đây ra
            khỏi kho SFCM vào ngày <b>{moment(header?.PICKUP_DATE).format("DD/MM/YYYY")}</b>
          </div>
        ) : (
          <div className="">
            Đề nghị đội giám sát kho bãi cho chúng tôi được rút hàng các container chung chủ sau đây
            vào kho SFCM
          </div>
        )}
        {type === "XK" ? (
          <div className="text-12">
            <div className="">
              <div className="text-14 font-bold">Thông tin chủ hàng:</div>
              <div>Email: {header?.EMAIL ?? "...................."}</div>
              <div>Số điện thoại: {header?.TELEPHONE ?? "...................."}</div>
              <div>Địa chỉ: {header?.ADDRESS ?? "...................."}</div>
            </div>
          </div>
        ) : (
          <div className="flex justify-between space-x-10 text-12">
            <div>
              <div className="text-14 font-bold">Thông tin đại lý:</div>
              <div>Email: {header?.EMAIL ?? "...................."}</div>
              <div>Số điện thoại: {header?.TELEPHONE ?? "...................."}</div>
              <div>Địa chỉ: {header?.ADDRESS ?? "...................."}</div>
            </div>
            <div>
              <div className="text-14 font-bold">Thông tin chuyến tàu:</div>
              <div>Mã chuyến tàu: {header?.ID ?? "...................."}</div>
              <div>Tên tàu: {header?.VESSEL_NAME ?? "...................."}</div>
              <div>
                Ngày tàu đến:{" "}
                {header?.ETA ? moment(header?.ETA).format("DD/MM/YYYY") : "...................."}
              </div>
            </div>
          </div>
        )}

        {header?.NOTE && <i className="text-12">Ghi chú: {header?.NOTE}</i>}

        {type === "XK" ? <ExportTable detail={detail} /> : <ImportTable detail={detail} />}

        <div className="mt-3 flex justify-between space-x-3 text-center text-sm font-bold">
          {type === "XK" ? (
            <div className="pl-5">Đại diện chủ hàng</div>
          ) : (
            <div className="pl-5">Đại diện đại lý</div>
          )}
          <div className="pr-5">
            <div>Cảng Quốc Tế SFCM</div>
            <div className="mt-20">{user?.userInfo?.FULLNAME}</div>
          </div>
        </div>
        <div
          className={cn(
            "absolute bottom-5 w-full text-center text-12",
            !hiddenToPrint ? "hidden-to-print" : ""
          )}
        >
          <i>(Chỉ có hiệu lực khi đã xác nhận thanh toán)</i>
        </div>
        {statusOrder && statusOrder === "CANCELLED" && (
          <div className="absolute-center -rotate-12">
            <span className="border-4 border-red-500 p-5 text-6xl font-bold text-red-500">
              ĐÃ HỦY
            </span>
          </div>
        )}
      </div>
    );
  }
);

const ImportTable = ({ detail }) => {
  return (
    <table className="goods-manifest-table-print">
      <thead>
        <tr>
          <th>STT</th>
          <th>Số container</th>
          <th>Kích thước container</th>
          <th>Số seal</th>
          <th>Ghi chú</th>
        </tr>
      </thead>
      <tbody>
        {detail?.map((row, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{row.CNTR_NO}</td>
            <td>{row.CNTR_SIZE}ft</td>
            <td>{row.SEAL_NO}</td>
            <td>{row.cntr_NOTE}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const ExportTable = ({ detail }) => {
  return (
    <table className="goods-manifest-table-print">
      <thead>
        <tr>
          <th>STT</th>
          <th>Số House Bill</th>
          <th>Loại hàng</th>
          <th>Số lượng</th>
          <th>Số khối</th>
          <th>Ngày nhập kho</th>
        </tr>
      </thead>
      <tbody>
        {detail?.map((row, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{row.HOUSE_BILL}</td>
            <td>{row.PACKAGE_TYPE_ID}</td>

            <td>
              {row.TOTAL_ITEMS} ({row.PACKAGE_UNIT})
            </td>
            <td>{row.CBM}</td>
            <td>{moment(row.TIME_IN).format("DD/MM/YYYY")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
