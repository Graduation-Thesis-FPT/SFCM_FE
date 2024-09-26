import { axiosPrivate } from "@/config/axios";
import moment from "moment";

export const loadCancelOrder = async ({ from, to, TYPE, ORDER_ID, CUSTOMER_ID }) => {
  if (from > to) throw new Error("Chọn ngày không hợp lệ!");
  return await axiosPrivate.get(`import/load-cancel-order`, {
    params: {
      from: moment(from).startOf("day").format("Y-MM-DD HH:mm:ss"),
      to: moment(to).endOf("day").format("Y-MM-DD HH:mm:ss"),
      TYPE,
      ORDER_ID,
      CUSTOMER_ID
    }
  });
};

export const cancelOrder = async data => {
  return await axiosPrivate.post(`import/cancel-order`, data);
};
