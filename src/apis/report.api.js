import { axiosPrivate } from "@/config/axios";

export const getAllImportTallyContainer = async () =>
  await axiosPrivate.get(`job-quantity-check/import-tally`);
