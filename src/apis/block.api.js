import { axiosPrivate } from "@/config/axios";

export const getBlock = async () => {
  return await axiosPrivate.get(`block`);
};

export const createBlock = async data => {
  return await axiosPrivate.post(`block`, data);
};

export const deleteBlock = async data => {
  return await axiosPrivate.delete(`block`, { data: { BLOCKID_LIST: data } });
};

export const getAllCellByWarehouseAndBlockCode = async (WAREHOUSE_ID, BLOCK_ID) => {
  return await axiosPrivate.get(`block/cell?WAREHOUSE_ID=${WAREHOUSE_ID}&BLOCK_ID=${BLOCK_ID}`);
};
