import { axiosPrivate } from "@/config/axios";

export const getAllCustomerType = async () => {
  return await axiosPrivate.get(`customer-type`);
};

export const createAndUpdateCustomerType = async data => {
  return await axiosPrivate.post(`customer-type`, data);
};

export const deleteCustomerType = async arr => {
  return await axiosPrivate.delete(`customer-type`, { data: { CUSTOMERTYPE_CODE_LIST: arr } });
};
