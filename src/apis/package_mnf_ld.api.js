import { axiosPrivate } from "@/config/axios";

export const getPackageMnfLdByFilter = async ROWGUID => {
  return await axiosPrivate.get(`package?REF_CONTAINER=${ROWGUID}`);
};

export const createAndUpdatePackageMnfLd = async data => {
  return await axiosPrivate.post(`package`, data);
};

export const deletePackageMnfLd = async arr => {
  return await axiosPrivate.delete(`package`, { data: { packageRow: arr } });
};
