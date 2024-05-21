import { axiosPrivate } from "@/config/axios";

export const getAllPermission = async () => await axiosPrivate.get(`permission`);
export const grantPermission = async data => await axiosPrivate.post(`permission`, data);
