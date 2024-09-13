import { axiosPrivate } from "@/config/axios";

export const getAllPackageType = async () => {
  return await axiosPrivate.get(`package-type`);
};

export const createAndUpdatePackageType = async data => {
  return await axiosPrivate.post(`package-type`, data);
};

export const deletePackageType = async arr => {
  return await axiosPrivate.delete(`package-type`, { data: { ItemTypeCodeList: arr } });
};
