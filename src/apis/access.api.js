import axios, { axiosPrivate } from "@/config/axios";

const login = async userInfo => await axios.post(`auth/login`, userInfo);
const changeDefaultPassword = async (userId, userInfo) =>
  await axios.patch(`auth/change-default-password/${userId}`, userInfo);

const changePassword = async ({ data }) => await axiosPrivate.patch(`auth/change-password`, data);

const refreshToken = async () => {
  let refreshToken = JSON.parse(localStorage.getItem("refreshToken"));
  if (!refreshToken) throw new Error("No refresh token found!");
  return await axiosPrivate.post(`auth/refresh-token`);
};

export { changeDefaultPassword, changePassword, login, refreshToken };
