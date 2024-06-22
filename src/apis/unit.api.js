import { axiosPrivate } from "@/config/axios";

export const getAllUnit = async () => {
  return await axiosPrivate.get(`unit`);
};

export const createAndUpdateUnit = async data => {
  return await axiosPrivate.post(`unit`, data);
};

export const deleteUnit = async arr => {
  return await axiosPrivate.delete(`unit`, { data: { UnitCodeList: arr } });
};
