import { axiosPrivate } from "@/config/axios";

export const getAllPalletPositionByWarehouseCode = async WAREHOUSE_CODE => {
  return await axiosPrivate.get(`pallet/cell-position?warehouseCode=${WAREHOUSE_CODE}`);
};

export const getPalletByStatus = async palletStatus => {
  return await axiosPrivate.get(`pallet?palletStatus=${palletStatus}`);
};

export const inputPalletToCell = async obj => {
  return await axiosPrivate.patch("pallet", obj);
};

export const changePalletPosition = async obj => {
  return await axiosPrivate.patch("pallet/change-position", obj);
};
