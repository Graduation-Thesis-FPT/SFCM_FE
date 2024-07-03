import { axiosPrivate } from "@/config/axios";

export const getAllPackageUnit = async () => {
  return await axiosPrivate.get(`package-unit`);
};

export const createAndUpdatePackageUnit = async data => {
  return await axiosPrivate.post(`package-unit`, data);
};

export const deletePackageUnit = async arr => {
  return await axiosPrivate.delete(`package-unit`, { data: { PackageUnitCodeList: arr } });
};
