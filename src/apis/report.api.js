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

export const getReportRevenue = async ({ from, to, isInEx = "", INV_NO = "", PAYER = "" }) => {
  return await axiosPrivate.get(`inv-vat`, {
    params: {
      from: moment(from).startOf("day").format("YYYY-MM-DD HH:mm:ss"),
      to: moment(to).endOf("day").format("YYYY-MM-DD HH:mm:ss"),
      isInEx: isInEx === "all" ? "" : isInEx,
      PAYER: PAYER === "all" ? "" : PAYER,
      INV_NO
    }
  });
};

export const viewOrderDtl = async fkey => {
  return await axiosPrivate.get(`order/viewOrderDtl/${fkey}`);
  f;
};
