import { axiosPrivate } from "@/config/axios";
import moment from "moment";

export const getAllVoyage = async () => {
  return await axiosPrivate.get(`voyage`);
};

export const getVoyageByFilter = async (fromDate, toDate) => {
  if (fromDate > toDate) throw new Error("Chọn ngày không hợp lệ!");
  return await axiosPrivate.get(
    `voyage?from=${moment(fromDate).startOf("day").format("Y-MM-DD HH:mm:ss")}&to=${moment(toDate).endOf("day").format("Y-MM-DD HH:mm:ss")}`
  );
};

export const createAndUpdateVoyage = async data => {
  return await axiosPrivate.post(`voyage`, data);
};

export const deleteVoyage = async arr => {
  return await axiosPrivate.delete(`voyage`, { data: { VOYAGE_ID_LIST: arr } });
};
