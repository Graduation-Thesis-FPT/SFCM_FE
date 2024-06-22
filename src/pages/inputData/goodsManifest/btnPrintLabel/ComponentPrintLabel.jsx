import { getAllCustomer } from "@/apis/customer.api";
import { dt_cntr_mnf_ld, dt_package_mnf_ld } from "@/components/common/aggridreact/dbColumns";
import { forwardRef, useEffect, useState } from "react";

export const ComponentPrintLabel = forwardRef(
  ({ selectedRow = [], vesselInfo = {}, containerInfo = {} }, ref) => {
    const [customerInfo, setCustomerInfo] = useState({});

    const getCustomerInfo = () => {
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
    };

    useEffect(() => {
      getCustomerInfo();
    }, []);

    return (
      <div ref={ref} className="space-y-5 p-5 font-bold">
        <span className="flex justify-between">
          <div>In label</div>
          <div>Tổng số tờ: {selectedRow.length}</div>
        </span>
        {selectedRow.map(row => (
          <div key={row.ROWGUID} className="border p-5">
            <span className="grid grid-cols-4">
              <span className="col-span-3 ml-3 space-y-3">
                <div>Số Container: {containerInfo.CNTRNO}</div>
                <div>Số Seal: {containerInfo.SEALNO}</div>
                <div>
                  Tên đại lý: {customerInfo?.CUSTOMER_NAME} - {customerInfo?.CUSTOMER_CODE}
                </div>
                <div>Số House Bill: {row.HOUSE_BILL}</div>
                <div>Loại hàng: {row.ITEM_TYPE_CODE}</div>
              </span>
              <span className="space-y-3">
                <div>Số lô: {row.LOT_NO}</div>
                <div>Số lượng: {row.CARGO_PIECE}</div>
                <div>Số khối: {row.CBM}</div>
              </span>
            </span>
          </div>
        ))}
      </div>
    );
  }
);
