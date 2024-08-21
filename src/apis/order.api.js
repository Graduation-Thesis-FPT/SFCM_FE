import { axiosPrivate } from "@/config/axios";
import moment from "moment";

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

export const invoicePublishIn = async args => {
  return await axiosPrivate.post(`order/publishInvoice`, args);
};

export const viewInvoice = async fkey => {
  return await axiosPrivate.get(`order/viewInvoice?fkey=${fkey}`);
};

//export order
export const getExContainerByVoyagekey = async VOYAGEKEY => {
  return await axiosPrivate.get(`order/getContainerList?VOYAGEKEY=${VOYAGEKEY}`);
};

export const getExManifest = async ({ VOYAGEKEY, CONTAINER_ID, HOUSE_BILL }) => {
  return await axiosPrivate.get(
    `order/getExManifest?VOYAGEKEY=${VOYAGEKEY}&CONTAINER_ID=${CONTAINER_ID}&HOUSE_BILL=${HOUSE_BILL}`
  );
};

export const getToBillEx = async (arrayPackage, services) => {
  return await axiosPrivate.post(`order/getToBillEx`, { arrayPackage, services });
};

export const invoicePublishEx = async args => {
  return await axiosPrivate.post(`order/publishInvoiceEx`, args);
};

export const saveExOrder = async (
  arrayPackage = [],
  paymentInfoHeader = {},
  paymentInfoDtl = []
) => {
  return await axiosPrivate.post(`order/saveExOrder`, {
    arrayPackage: arrayPackage,
    paymentInfoHeader: paymentInfoHeader,
    paymentInfoDtl: paymentInfoDtl
  });
};

export const getCancelInvoice = async ({ from, to }) => {
  return await axiosPrivate.get(`order/getCancelInvoice`, {
    params: {
      from: moment(from).startOf("day").format("YYYY-MM-DD HH:mm:ss"),
      to: moment(to).endOf("day").format("YYYY-MM-DD HH:mm:ss")
    }
  });
};

export const cancelInvoice = async ({
  fkey = "",
  reason = "",
  cancelDate = new Date(),
  invNo = ""
}) => {
  return await axiosPrivate.post(`order/cancel`, {
    fkey,
    reason,
    cancelDate: moment(cancelDate).format("YYYY-MM-DD HH:mm:ss"),
    invNo
  });
};
