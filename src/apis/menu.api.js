import { axiosCache, axiosPrivate } from "@/config/axios";

export const getMenuByRoleCode = async () =>
  await axiosCache.get(`menu`, {
    id: "menu",
    cache: {
      ttl: 60 * 60 * 1000,
      interpretHeader: false
    }
  });
