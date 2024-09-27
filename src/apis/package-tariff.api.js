import { axiosPrivate } from "@/config/axios";

export const getAllPackageTariff = async () => {
  return await axiosPrivate.get(`package-tariff`);
};

export const createPackageTariff = async data => {
  return await axiosPrivate.post(`package-tariff`, data);
};

export const deletePackageTariff = async listID => {
  return await axiosPrivate.delete(`package-tariff`, { data: { packageTariffCode: listID } });
};
///////////
export const getPackageTariffDetailByFK = async PACKAGE_TARIFF_ID => {
  return await axiosPrivate.get(`package-tariff-detail?PACKAGE_TARIFF_ID=${PACKAGE_TARIFF_ID}`);
};

export const createAndUpdatePackageTariffDetail = async (data, packageTariffId) => {
  return await axiosPrivate.post(`package-tariff-detail?packageTariffId=${packageTariffId}`, data);
};
