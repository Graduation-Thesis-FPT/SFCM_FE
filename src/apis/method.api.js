import { axiosPrivate } from "@/config/axios";

export const getAllMethod = async () => {
  return await axiosPrivate.get(`method`);
};

export const createAndUpdateMethod = async data => {
  return await axiosPrivate.post(`method`, data);
};

export const deleteMethod = async arr => {
  return await axiosPrivate.delete(`method`, { data: { METHOD_CODE: arr } });
};
