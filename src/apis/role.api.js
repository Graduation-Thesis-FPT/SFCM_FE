import { axiosPrivate } from "@/config/axios";

const getAllRole = async () => await axiosPrivate.get(`role`);

export { getAllRole };
