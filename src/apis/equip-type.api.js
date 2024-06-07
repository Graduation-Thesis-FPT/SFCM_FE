import { axiosPrivate } from "@/config/axios";

export const getAllEquipType = async () => {
  return await axiosPrivate.get(`equip-type`);
};

export const createAndUpdateEquipType = async data => {
  return await axiosPrivate.post(`equip-type`, data);
};

export const deleteEquipType = async arr => {
  return await axiosPrivate.delete(`equip-type`, { data: { EQU_TYPE_LIST: arr } });
};
