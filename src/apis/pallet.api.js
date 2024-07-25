import { axiosPrivate } from "@/config/axios";

export const getAllPalletPositionByWarehouseCode = async WAREHOUSE_CODE => {
  return await axiosPrivate.get(`pallet/cell-position?warehouseCode=${WAREHOUSE_CODE}`);
};

export const getListJobImport = async palletStatus => {
  return await axiosPrivate.get(`pallet/list-import-job?palletStatus=${palletStatus}`);
};

export const inputPalletToCell = async obj => {
  return await axiosPrivate.patch("pallet", obj);
};

export const changePalletPosition = async obj => {
  return await axiosPrivate.patch("pallet/change-position", obj);
};

export const exportPallet = async data => {
  return await axiosPrivate.patch(`pallet/export`, data);
};

export const getListJobExport = async () => {
  return await axiosPrivate.get(`pallet/list-export-job`);
};
