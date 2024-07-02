import { axiosPrivate } from "@/config/axios";

export const getAllConfigAttachSrv = async () => {
  return await axiosPrivate.get(`config-attach-srv`);
};

export const getConfigAttachSrvByMethodCode = async METHOD_CODE => {
  return await axiosPrivate.get(`config-attach-srv/${METHOD_CODE}`);
};

export const createAndUpdateConfigAttachSrvByMethodCode = async (METHOD_CODE, data) => {
  return await axiosPrivate.post(`config-attach-srv/${METHOD_CODE}`, data);
};
