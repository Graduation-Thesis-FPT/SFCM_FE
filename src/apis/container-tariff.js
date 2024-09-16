import { axiosPrivate } from "@/config/axios";

export const getAllContainerTariff = async () => {
  return axiosPrivate.get(`container-tariff`);
};

export const createAndUpdateConatinerTariff = async data => {
  return axiosPrivate.post(`container-tariff`, data);
};
