import { axiosPrivate } from "@/config/axios";

export const getAllPermissionByRoleCode = async ROLE_CODE => {
  return await axiosPrivate.get(`permission?roleCode=${ROLE_CODE}`);
};

export const updatePermission = async data => await axiosPrivate.patch(`permission`, data);

export const grantPermission = async menuCode => {
  return await axiosPrivate.get(`permission/grant-permission?menuCode=${menuCode}`);
};
