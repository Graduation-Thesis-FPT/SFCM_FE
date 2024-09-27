import { axiosPrivate } from "@/config/axios";

export const getPayment = async ({ status, orderId, orderType, searchQuery }) => {
  return await axiosPrivate.get(
    `payment?
    status=${status || ""}&
    orderId=${orderId || ""}&
    orderType=${orderType || ""}&
    searchQuery=${searchQuery || ""}`.replace(/\s+/g, "")
  );
};
export const updatePaymentStatus = async ({ paymentInfo }) => {
  return await axiosPrivate.post(`payment`, { paymentInfo });
};
