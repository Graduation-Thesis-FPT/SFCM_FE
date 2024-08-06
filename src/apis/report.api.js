import { axiosPrivate } from "@/config/axios";
import moment from "moment";

export const getReportInExOrder = async ({
  from,
  to,
  isInEx = "",
  CUSTOMER_CODE = "",
  CNTRNO = ""
}) =>
  await axiosPrivate.get(`order/getReportInExOrder`, {
    params: {
      from: moment(from).startOf("day").format("YYYY-MM-DD HH:mm:ss"),
      to: moment(to).endOf("day").format("YYYY-MM-DD HH:mm:ss"),
      isInEx: isInEx === "all" ? "" : isInEx,
      CUSTOMER_CODE: CUSTOMER_CODE === "all" ? "" : CUSTOMER_CODE,
      CNTRNO
    }
  });

export const getReportRevenue = async () => {
  return await axiosPrivate.get(`inv-vat`);
};
