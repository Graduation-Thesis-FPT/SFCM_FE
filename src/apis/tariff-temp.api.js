import { axiosPrivate } from "@/config/axios";

export const getAllTariffTemp = async () => {
  return await axiosPrivate.get(`tariff-temp`);
};

export const createTariffTemp = async data => {
  return await axiosPrivate.post(`tariff-temp`, data);
};

export const deleteTariffTemp = async arr => {
  return await axiosPrivate.delete(`tariff-temp`, { data: { tariffTempCode: arr } });
};
