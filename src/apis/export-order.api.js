import { axiosPrivate } from "@/config/axios";
import moment from "moment";

export const getPackageCanExportByConsigneeId = async id => {
  return await axiosPrivate.get(`export-order/package-can-export?CONSIGNEE_ID=${id}`);
};

export const getExportOrderById = async id => {
  return await axiosPrivate.get(`export-order/${id}`);
};

export const getExportOrders = async (consigneeId, from, to) => {
  return await axiosPrivate.get(`export-order?consigneeId=${consigneeId}&from=${from}$to=${to}`);
};

export const getExportOrderForDocById = async ID => {
  return await axiosPrivate.get(`export-order/doc?ID=${ID}`);
};

export const calculateExportOrder = async (voyageContainerPackageIds, pickupDate) => {
  return await axiosPrivate.post(`export-order/calculate`, {
    voyageContainerPackageIds: voyageContainerPackageIds,
    pickupDate: moment(pickupDate).endOf("day").format("YYYY-MM-DD HH:mm:ss")
  });
};

export const saveExportOrder = async data => {
  return await axiosPrivate.post(`export-order/create`, data);
};

export const getAllCustomerCanExportOrders = async () => {
  return await axiosPrivate.get(`export-order/suggest`);
};
