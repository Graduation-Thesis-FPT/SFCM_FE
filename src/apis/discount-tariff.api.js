import { axiosPrivate } from "@/config/axios";

export const getAllDiscountTariff = async () => {
  return await axiosPrivate.get(`discount-tariff`);
};

export const getDiscountTariffByTemplate = async template => {
  return await axiosPrivate.get(`discount-tariff/filter?template=${template}`);
};

export const createAndUpdateDiscountTariff = async data => {
  return await axiosPrivate.post(`discount-tariff`, data);
};

export const deleteDiscountTariff = async arr => {
  return await axiosPrivate.delete(`discount-tariff`, { data: { discountTariffCodeList: arr } });
};
