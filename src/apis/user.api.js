import axios, { axiosPrivate } from "@/config/axios";

const getAllUser = async () => await axios.get(`user`);
const createAccount = async data => await axiosPrivate.post(`user`, data);
export { getAllUser, createAccount };
