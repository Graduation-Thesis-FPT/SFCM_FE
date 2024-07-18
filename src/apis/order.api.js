import { axiosPrivate } from "@/config/axios";

export const getContList = async (data = {}) => {
  return await axiosPrivate.get(
    `order/getcont?VOYAGEKEY=${data.VOYAGEKEY}&BILLOFLADING=${data.BILLOFLADING}`
  );
};

export const getManifestPackage = async (data = {}) => {
  return await axiosPrivate.get(
    `order/getPackageData?VOYAGEKEY=${data.VOYAGEKEY}&CNTRNO=${data.CNTRNO}`
  );
};

export const getToBillIn = async (arrayPackage, services) => {
  return await axiosPrivate.post(`order/getToBillIn`, { arrayPackage, services });
};

export const saveInOrder = async (
  arrayPackage = [],
  paymentInfoHeader = {},
  paymentInfoDtl = []
) => {
  return await axiosPrivate.post(`order/saveInOrder`, {
    arrayPackage: arrayPackage,
    paymentInfoHeader: paymentInfoHeader,
    paymentInfoDtl: paymentInfoDtl
  });
};

export const invoicePublish = async args => {
  return await axiosPrivate.post(`order/publishInvoice`, args);
};

export const viewInvoice = async fkey => {
  return await axiosPrivate.get(`order/viewInvoice?fkey=${fkey}`);
};
