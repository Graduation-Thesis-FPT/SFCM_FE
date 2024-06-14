import { axiosPrivate } from "@/config/axios";

export const getManifestLoadingListContByFilter = async VOYAGEKEY => {
  return await axiosPrivate.get(`container?VOYAGEKEY=${VOYAGEKEY}`);
};

export const createAndUpdateManifestLoadingListCont = async data => {
  return await axiosPrivate.post(`container`, data);
};

export const deleteManifestLoadingListCont = async arr => {
  return await axiosPrivate.delete(`container`, { data: { CONTAINER_ROWGUID: arr } });
};
