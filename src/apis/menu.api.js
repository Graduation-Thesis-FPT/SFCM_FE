import { axiosPrivate } from "@/config/axios";

export const getMenuByRoleCode = async () => await axiosPrivate.get(`menu`);
