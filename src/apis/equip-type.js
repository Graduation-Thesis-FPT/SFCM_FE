import { axiosPrivate } from "@/config/axios";

export const getAllEquipType = async ROLE_CODE => {
  return await axiosPrivate.get(`equip-type`);
};
