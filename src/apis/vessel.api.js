import { axiosPrivate } from "@/config/axios";
import moment from "moment";

export const getAllVessel = async () => {
  return await axiosPrivate.get(`vessel`);
};

export const getVesselByFilter = async (fromDate, toDate) => {
  if (fromDate > toDate) throw new Error("Chọn ngày không hợp lệ!");
  return await axiosPrivate.get(
    `vessel?from=${moment(fromDate).format("Y-M-D H:m:s")}&to=${moment(toDate).format("Y-M-D H:m:s")}`
  );
};

export const createAndUpdateVessel = async data => {
  return await axiosPrivate.post(`vessel`, data);
};

export const deleteVessel = async arr => {
  return await axiosPrivate.delete(`vessel`, { data: { VESSEL_CODE_LIST: arr } });
};
