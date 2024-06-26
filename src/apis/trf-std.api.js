import { axiosPrivate } from "@/config/axios";

export const getAllStandardTariff = async () => {
  return await axiosPrivate.get(`tariff`);
};

export const getStandardTariffByTemplate = async template => {
  return await axiosPrivate.get(`tariff/filter?template=${template}`);
};

export const getAllStandardTariffTemplate = async () => {
  return await axiosPrivate.get(`tariff/template`);
};

export const createAndUpdateStandardTariff = async data => {
  return await axiosPrivate.patch(`tariff`, data);
};

export const createStandardTariffTemplate = async data => {
  return await axiosPrivate.post(`tariff`, data);
};

export const deleteStandardTariff = async arr => {
  return await axiosPrivate.delete(`tariff`, { data: { tariffCodeList: arr } });
};
