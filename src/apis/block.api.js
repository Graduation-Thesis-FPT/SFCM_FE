import { axiosPrivate } from "@/config/axios";

export const getBlock = async () => {
  return await axiosPrivate.get(`block`);
};

export const createBlock = async data => {
  return await axiosPrivate.post(`block`, data);
};

export const deleteBlock = async data => {
  return await axiosPrivate.delete(`block`, { data: { ROWGUID_LIST: data } });
};
