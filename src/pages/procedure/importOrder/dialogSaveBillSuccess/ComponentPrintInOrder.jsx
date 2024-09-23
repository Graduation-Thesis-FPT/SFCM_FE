import moment from "moment";
import { forwardRef } from "react";
import { useSelector } from "react-redux";
import logo from "@/assets/image/Logo_128x128.svg";
import { Separator } from "@/components/common/ui/separator";

export const ComponentPrintInOrder = forwardRef(
  ({ dataBillAfterSave = {}, billInfoList = [], filterInfoSelected = {} }, ref) => {
    const user = useSelector(state => state.userSlice.user);
    return (
      // hidden-to-print
      <div ref={ref} className="hidden-to-print space-y-3 p-10">
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
                <div className="text-32 font-bold">LỆNH NHẬP HÀNG VÀO KHO</div>
                <div className="">
                  Ngày {moment().format("DD")} Tháng {moment().format("MM")} Năm{" "}
                  {moment().format("Y")}
                </div>
              </div>
            </span>
          </div>
        </div>
        <div className="font-semibold">
          Mã lệnh: {dataBillAfterSave?.importOrder?.ID ?? "...................."}
        </div>
        <div className="">
          Cảng Quốc Tế SFCM đại diện cho đại lý:{" "}
          <span className="font-bold">
            {filterInfoSelected?.FULLNAME ?? "...................."}
          </span>
        </div>
        <div className="">
          Đề nghị đội giám sát kho bãi cho chúng tôi được rút hàng các container chung chủ sau đây
          vào kho SFCM
        </div>
        <div className="font-bold">
          <div className="flex justify-between">
            <div>Mã chuyến tàu: {filterInfoSelected?.ID ?? "...................."}</div>
            <div>Tên tàu: {filterInfoSelected?.VESSEL_NAME ?? "...................."}</div>
            <div>
              Ngày tàu đến:{" "}
              {filterInfoSelected?.ETA
                ? moment(filterInfoSelected?.ETA).format("DD/MM/YYYY")
                : "...................."}
            </div>
          </div>
        </div>
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
            {dataBillAfterSave?.neworderDtl?.map((row, index) => (
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

        <div className="mt-3 flex justify-between space-x-3 text-center text-sm font-bold">
          <div className="pl-5">Đại diện đại lý</div>
          <div className="pr-5">
            <div>Cảng Quốc Tế SFCM</div>
            <div className="mt-20">{user?.userInfo?.FULLNAME}</div>
          </div>
        </div>
      </div>
    );
  }
);
