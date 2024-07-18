import { axiosPrivate } from "@/config/axios";

export const suggestCellByWarehouseCode = async (warehouseCode, palletInfo) => {
  return await axiosPrivate.get(`cell?warehouseCode=${warehouseCode}`, { params: palletInfo });
};
