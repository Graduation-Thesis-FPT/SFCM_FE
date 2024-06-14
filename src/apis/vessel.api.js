import { axiosPrivate } from "@/config/axios";

export const getAllVessel = async () => {
  return await axiosPrivate.get(`vessel`);
};

export const getVesselByFilter = async (fromDate, toDate) => {
  return await axiosPrivate.get(`vessel?from=${fromDate}&to=${toDate}`);
};

export const createAndUpdateVessel = async data => {
  return await axiosPrivate.post(`vessel`, data);
};

export const deleteVessel = async arr => {
  return await axiosPrivate.delete(`vessel`, { data: { VESSEL_CODE_LIST: arr } });
};
