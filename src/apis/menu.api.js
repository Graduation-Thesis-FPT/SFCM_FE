import { axiosCache } from "@/config/axios";

export const getMenuByRoleCode = async () =>
  await axiosCache.get(`menu`, {
    id: "grant-menu",
    // cache: {
    //   ttl: 60 * 60 * 1000,
    //   interpretHeader: false
    // }
  });
