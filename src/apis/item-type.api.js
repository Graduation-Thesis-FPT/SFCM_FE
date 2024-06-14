import { axiosPrivate } from "@/config/axios";

export const getAllItemType = async () => {
  return await axiosPrivate.get(`item-type`);
};

export const createAndUpdateItemType = async data => {
  return await axiosPrivate.post(`item-type`, data);
};

export const deleteItemType = async arr => {
  return await axiosPrivate.delete(`item-type`, { data: { ItemTypeCodeList: arr } });
};
