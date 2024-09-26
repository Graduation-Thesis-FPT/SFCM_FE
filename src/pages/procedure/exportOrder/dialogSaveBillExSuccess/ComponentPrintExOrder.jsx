import moment from "moment";
import { forwardRef } from "react";
import { useSelector } from "react-redux";
import logo from "@/assets/image/Logo_64x64.svg";
import { Separator } from "@/components/common/ui/separator";

export const ComponentPrintExOrder = forwardRef(
  ({ header = {}, detail = [], type = "XK" }, ref) => {
    const user = useSelector(state => state.userSlice.user);
    return (
      <div ref={ref} className="hidden-to-print relative min-h-[100vh] space-y-3 p-10">
        <div className="flex items-center space-x-4">
          <img src={logo} className="size-[110px]" />
          <div className="w-full">
            <span>
              <div className="text-center">
                <div>Cảng quốc tế SFCM</div>
                <div>Kho SFCM</div>
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
          ""
        ) : (
          <div className="font-bold">
            <div className="flex justify-between">
              <div>Mã chuyến tàu: {header?.ID ?? "...................."}</div>
              <div>Tên tàu: {header?.VESSEL_NAME ?? "...................."}</div>
              <div>
                Ngày tàu đến:{" "}
                {header?.ETA ? moment(header?.ETA).format("DD/MM/YYYY") : "...................."}
              </div>
            </div>
          </div>
        )}

        {header?.NOTE && <div>{header?.NOTE}</div>}

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
        <div className="absolute bottom-5 w-full text-center text-12">
          <i>(Chỉ có hiệu lực khi đã xác nhận thanh toán)</i>
        </div>
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
            <td>{row.CNTR_SIZE}</td>
            <td>{row.SEAL_NO}</td>
            <td>{row.NOTE}</td>
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
