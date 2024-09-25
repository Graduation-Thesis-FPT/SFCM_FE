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

///////// fork lift

export const getPackageReadyToWarehouse = async () => {
  return await axiosPrivate.get(`package-cell-allocation/ready-to-warehouse`);
};
