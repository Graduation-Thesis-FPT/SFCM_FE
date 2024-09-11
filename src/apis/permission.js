import { axiosPrivate } from "@/config/axios";

export const getAllPermissionByRoleId = async ({ roleId }) => {
  return await axiosPrivate.get(`permission?roleId=${roleId}`);
};

export const updatePermission = async ({ data }) => await axiosPrivate.patch(`permission`, data);

export const grantPermission = async ({ menuId }) => {
  return await axiosPrivate.get(`permission/grant-permission?menuId=${menuId}`);
};
