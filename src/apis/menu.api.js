import { axiosPrivate } from "@/config/axios";

export const getMenuByRoleCode = async ROLE_CODE => {
  return await axiosPrivate.get(`menu?roleCode=${ROLE_CODE}`);
};
