import { axiosPrivate } from "@/config/axios";

export const getVoyageContainerPackage = async VOYAGE_CONTAINER_ID => {
  return await axiosPrivate.get(
    `voyage-container-package?VOYAGE_CONTAINER_ID=${VOYAGE_CONTAINER_ID}`
  );
};

export const createAndUpdateVoyContPackage = async (data, VOYAGE_CONTAINER_ID) => {
  return await axiosPrivate.post(
    `voyage-container-package?VOYAGE_CONTAINER_ID=${VOYAGE_CONTAINER_ID}`,
    data
  );
};

export const deleteVoyContPackage = async arr => {
  return await axiosPrivate.delete(`voyage-container-package`, { data: { PACKAGE_ID: arr } });
};
