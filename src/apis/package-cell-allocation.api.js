import { axiosPrivate } from "@/config/axios";

export const getAllImportedContainer = async () => {
  return await axiosPrivate.get(`package-cell-allocation/imported-containers`);
};

export const getAllPackageByVoyageContainerId = async VOYAGE_CONTAINER_ID => {
  return await axiosPrivate.get(`package-cell-allocation/voyage-package/${VOYAGE_CONTAINER_ID}`);
};

export const getAllPackageCellAllocationByVoyContPkID = async VOYAGE_CONTAINER_PACKAGE_ID => {
  return await axiosPrivate.get(`package-cell-allocation/${VOYAGE_CONTAINER_PACKAGE_ID}`);
};

export const getReadyToWarehouse = async () => {
  return await axiosPrivate.get(`package-cell-allocation/ready-to-warehouse`);
};

export const insertAndUpdatePackageCellAllocation = async (
  VOYAGE_CONTAINER_PACKAGE_ID,
  listData
) => {
  return await axiosPrivate.post(
    `package-cell-allocation?PACKAGE_ID=${VOYAGE_CONTAINER_PACKAGE_ID}`,
    listData
  );
};

export const completePackageSeparate = async VOYAGE_CONTAINER_PACKAGE_ID => {
  return await axiosPrivate.patch(
    `package-cell-allocation/complete/${VOYAGE_CONTAINER_PACKAGE_ID}`
  );
};

// export const getAllContainerByVoyIdAndCusId = async (VOYAGE_ID, SHIPPER_ID) => {
//   return await axiosPrivate.get(
//     `import/import-container?VOYAGE_ID=${VOYAGE_ID}&SHIPPER_ID=${SHIPPER_ID}`
//   );
// };

// export const calculateImportContainer = async listContId => {
//   return await axiosPrivate.post(`import/calculate`, { arrayContID: listContId });
// };

// export const saveImportOrder = async (arrayContID, paymentInfo, note) => {
//   return await axiosPrivate.post(`import/save`, {
//     arrayContID: arrayContID,
//     paymentInfo: paymentInfo,
//     note: note
//   });
// };
