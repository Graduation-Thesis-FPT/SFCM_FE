import { axiosPrivate } from "@/config/axios";
import moment from "moment";

export const getReportInExOrder = async ({
  from,
  to,
  isInEx = "",
  CUSTOMER_CODE = "",
  DE_ORDER_NO = ""
}) =>
  await axiosPrivate.get(`order/getReportInExOrder`, {
    params: {
      from: moment(from).startOf("day").format("YYYY-MM-DD HH:mm:ss"),
      to: moment(to).endOf("day").format("YYYY-MM-DD HH:mm:ss"),
      isInEx: isInEx === "all" ? "" : isInEx,
      CUSTOMER_CODE: CUSTOMER_CODE === "all" ? "" : CUSTOMER_CODE,
      DE_ORDER_NO
    }
  });

export const getReportRevenue = async ({ fromDate, toDate, TYPE, CUSTOMER_ID, PAYMENT_ID }) => {
  if (!fromDate || !toDate) throw new Error("Chưa chọn ngày!");
  if (fromDate > toDate) throw new Error("Chọn ngày không hợp lệ!");
  return await axiosPrivate.get(`import/load-report-revenue`, {
    params: {
      from: moment(fromDate).startOf("day").format("Y-MM-DD HH:mm:ss"),
      to: moment(toDate).endOf("day").format("Y-MM-DD HH:mm:ss"),
      TYPE: TYPE === "all" ? "" : TYPE,
      CUSTOMER_ID: CUSTOMER_ID === "all" ? "" : CUSTOMER_ID,
      PAYMENT_ID
    }
  });
};

export const viewOrderDtl = async fkey => {
  return await axiosPrivate.get(`order/viewOrderDtl/${fkey}`);
  f;
};
