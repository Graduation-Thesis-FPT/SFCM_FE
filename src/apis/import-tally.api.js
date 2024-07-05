import { axiosPrivate } from "@/config/axios";

export const getAllImportTallyContainer = async () =>
  await axiosPrivate.get(`job-quantity-check/import-tally`);

export const getImportTallyContainerInfoByCONTAINER_ID = async CONTAINER_ID =>
  await axiosPrivate.get(`job-quantity-check/import-tally/${CONTAINER_ID}`);

export const getAllJobQuantityCheckByPACKAGE_ID = async PACKAGE_ID =>
  await axiosPrivate.get(`job-quantity-check/${PACKAGE_ID}`);

export const insertAndUpdateJobQuantityCheck = async (PACKAGE_ID, arr) =>
  await axiosPrivate.post(`job-quantity-check/${PACKAGE_ID}`, arr);
