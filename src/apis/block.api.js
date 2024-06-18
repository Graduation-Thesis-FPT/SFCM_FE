import { axiosPrivate } from "@/config/axios";

export const getBlock = async () => {
  return await axiosPrivate.get(`block`);
};

export const createBlock = async ({data}) => {
  return await axiosPrivate.post(`block`, data);
};

export const deleteBlock = async data => {
  return await axiosPrivate.delete(`block`, { data: { BLOCKCODE_LIST: data } });
};

export const getAllCellByWarehouseAndBlockCode = async (WAREHOUSE_CODE, BLOCK_CODE) => {
  return await axiosPrivate.get(
    `block/cell?WAREHOUSE_CODE=${WAREHOUSE_CODE}&BLOCK_CODE=${BLOCK_CODE}`
  );
};
