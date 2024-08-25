import { getAllCustomer } from "@/apis/customer.api";
import { dt_package_mnf_ld } from "@/components/common/aggridreact/dbColumns";
import { useCustomToast } from "@/components/common/custom-toast";
import moment from "moment";
import { forwardRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const ComponentPrintGoodsMnf = forwardRef(
  ({ rowData = [], vesselInfo = {}, containerInfo = {} }, ref) => {
    const user = useSelector(state => state.userSlice.user);
    const [customerInfo, setCustomerInfo] = useState({});
    const toast = useCustomToast();
    const DT_PACKAGE_MNF_LD = new dt_package_mnf_ld();

    useEffect(() => {
      getAllCustomer()
        .then(res => {
          let temp = res.data.metadata?.filter(
            item => item.CUSTOMER_CODE === containerInfo.CONSIGNEE
          );
          if (temp.length > 0) {
            setCustomerInfo(temp[0]);
          }
        })
        .catch(err => {
          toast.error(err);
        });
    }, []);

    return (
      <div ref={ref} className="space-y-3 p-5">
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
          <div>CÔNG VĂN XIN ĐƯA HÀNG TỪ CONTAINER VÀO KHO</div>
          <div>
            <i>Kính gửi: Hải quan giám sát kho bãi</i>
          </div>
        </div>
        <div className="text-sm">
          Cảng Quốc Tế SFCM đại diện cho đại lý giao nhận:{" "}
          <span className="font-bold">{customerInfo?.CUSTOMER_NAME ?? "...................."}</span>
        </div>
        <div className="text-sm">
          Đề nghị đội Hải quan giám sát kho bãi cho chúng tôi được rút hàng vào kho các container
          hàng chung chủ sau đây vào kho SFCM
        </div>
        <div className="flex gap-10 text-sm font-bold">
          <div>TÊN TÀU: {vesselInfo?.VESSEL_NAME ?? "...................."}</div>
          <div>CHUYẾN: {vesselInfo?.INBOUND_VOYAGE ?? "...................."}</div>
          <div>NGÀY CẬP CẢNG: {vesselInfo.ETA ? vesselInfo.ETA : "...................."}</div>
        </div>
        <table className="goods-manifest-table-print">
          <thead>
            <tr>
              <th>STT</th>
              <th>Số House Bill</th>
              <th>Số Container</th>
              <th>Số Seal</th>
              <th>Tên đại lý</th>
              <th>Số lượng</th>
              <th>Số khối</th>
            </tr>
          </thead>
          <tbody>
            {rowData?.map((row, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{row[DT_PACKAGE_MNF_LD.HOUSE_BILL.field]}</td>
                <td>{index === 0 ? containerInfo?.CNTRNO : ""}</td>
                <td>{index === 0 ? containerInfo?.SEALNO : ""}</td>
                <td>{index === 0 ? customerInfo?.CUSTOMER_NAME : ""}</td>
                <td>{row[DT_PACKAGE_MNF_LD.CARGO_PIECE.field]}</td>
                <td>{row[DT_PACKAGE_MNF_LD.CBM.field]}</td>
              </tr>
            ))}
            <tr className="bg-gray-300">
              <td colSpan="5">Tổng cộng</td>
              <td>
                {rowData?.reduce(
                  (total, item) => total + item[DT_PACKAGE_MNF_LD.CARGO_PIECE.field],
                  0
                )}
              </td>
              <td>
                {rowData?.reduce((total, item) => total + item[DT_PACKAGE_MNF_LD.CBM.field], 0)}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-between text-center text-sm">
          <span>
            <div>Chúng tôi hoàn toàn chịu trách nhiệm về hàng hóa sau khi đã nhập kho</div>
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
