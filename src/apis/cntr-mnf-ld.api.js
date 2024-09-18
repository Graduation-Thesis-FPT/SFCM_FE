import { axiosPrivate } from "@/config/axios";

export const getVoyageContainerByVoyageID = async VOYAGE_ID => {
  return await axiosPrivate.get(`voyage-container?VOYAGE_ID=${VOYAGE_ID}`);
};

export const createAndUpdateVoyageContainer = async data => {
  return await axiosPrivate.post(`voyage-container`, data);
};

export const deleteManifestLoadingListCont = async arr => {
  return await axiosPrivate.delete(`voyage-container`, { data: { VOYAGE_CONTAINER_ID: arr } });
};
