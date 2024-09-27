import { axiosPrivate } from "@/config/axios";
import moment from "moment";

export const getAllVoyageWithCustomerCanImportOrder = async () => {
  return await axiosPrivate.get(`import/import-vessel-customer`);
};

export const getAllContainerByVoyIdAndCusId = async (VOYAGE_ID, SHIPPER_ID) => {
  return await axiosPrivate.get(
    `import/import-container?VOYAGE_ID=${VOYAGE_ID}&SHIPPER_ID=${SHIPPER_ID}`
  );
};

export const calculateImportContainer = async listContId => {
  return await axiosPrivate.post(`import/calculate`, { arrayContID: listContId });
};

export const saveImportOrder = async (arrayContID, paymentInfo, note) => {
  return await axiosPrivate.post(`import/save`, {
    arrayContID: arrayContID,
    paymentInfo: paymentInfo,
    note: note
  });
};

export const getImportOrderForDocById = async ID => {
  return await axiosPrivate.get(`import/doc?ID=${ID}`);
};
