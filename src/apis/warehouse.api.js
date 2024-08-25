import { axiosPrivate } from "@/config/axios";

export const getAllWarehouse = async () => {
  return await axiosPrivate.get(`warehouse`);
};

export const createWarehouse = async data => {
  return await axiosPrivate.post(`warehouse`, data);
};

export const deleteWarehouse = async ({ data }) => {
  return await axiosPrivate.delete(`warehouse`, { data: { warehouseCodeList: data } });
};
