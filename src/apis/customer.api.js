import { axiosPrivate } from "@/config/axios";

export const getAllCustomer = async () => {
  return await axiosPrivate.get(`customer`);
};

export const createAndUpdateCustomer = async data => {
  return await axiosPrivate.post(`customer`, data);
};

export const deleteCustomer = async arr => {
  return await axiosPrivate.delete(`customer`, { data: { CUSTOMER_CODE_LIST: arr } });
};
