import { axiosPrivate } from "@/config/axios";

export const getAllImportTallyContainer = async () =>
  await axiosPrivate.get(`job-quantity-check/import-tally`);

export const getImportTallyContainerInfoByCONTAINER_ID = async CONTAINER_ID =>
  await axiosPrivate.get(`job-quantity-check/import-tally/cont-info/${CONTAINER_ID}`);

export const getAllJobQuantityCheckByPACKAGE_ID = async PACKAGE_ID =>
  await axiosPrivate.get(`job-quantity-check/import-tally/${PACKAGE_ID}`);

export const insertAndUpdateJobQuantityCheck = async (PACKAGE_ID, arr) =>
  await axiosPrivate.post(`job-quantity-check/import-tally/${PACKAGE_ID}`, arr);

export const completeJobQuantityCheckByPackageId = async PACKAGE_ID =>
  await axiosPrivate.post(`job-quantity-check/import-tally/complete/${PACKAGE_ID}`);
