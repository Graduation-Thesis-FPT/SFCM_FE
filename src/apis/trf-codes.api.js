import { axiosPrivate } from "@/config/axios";

export const getAllTariffCode = async () => {
  return await axiosPrivate.get(`tariff-code`);
};

export const createAndUpdateTariffCode = async data => {
  return await axiosPrivate.post(`tariff-code`, data);
};

export const deleteTariffCode = async arr => {
  return await axiosPrivate.delete(`tariff-code`, { data: { tariffCodeList: arr } });
};
