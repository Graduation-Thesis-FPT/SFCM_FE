import { axiosPrivate } from "@/config/axios";

export const getAllEquipment = async () => {
  return await axiosPrivate.get(`equipment`);
};

export const createAndUpdateEquipment = async data => {
  return await axiosPrivate.post(`equipment`, data);
};

export const deleteEquipment = async arr => {
  return await axiosPrivate.delete(`equipment`, { data: { EQUIPMENT_CODE: arr } });
};
