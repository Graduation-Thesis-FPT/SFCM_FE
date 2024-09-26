import { axiosPrivate } from "@/config/axios";

export const suggestCellByWarehouseCode = async (warehouseCode, palletInfo) => {
  return await axiosPrivate.get(`cell?warehouseCode=${warehouseCode}`, { params: palletInfo });
};

export const getAllPackagePositionByWarehouseCode = async ID => {
  return await axiosPrivate.get(`cell/package-position?warehouseCode=${ID}`);
};

export const placePackageAllocatedIntoCell = async data => {
  return await axiosPrivate.patch(`cell/place-package`, data);
};

export const changePackageAllocatedPosition = async data => {
  return await axiosPrivate.patch(`cell/change-package-position`, data);
};
