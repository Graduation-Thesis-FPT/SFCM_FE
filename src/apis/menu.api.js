import { axiosCache } from "@/config/axios";

export const getMenuByRoleId = async () =>
  await axiosCache.get(`menu`, {
    id: "grant-menu",
    // cache: {
    //   ttl: 60 * 60 * 1000,
    //   interpretHeader: false
    // }
  });
