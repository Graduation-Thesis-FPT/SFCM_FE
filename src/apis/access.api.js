import axios, { axiosPrivate } from "@/config/axios";

const login = async userInfo => await axios.post(`auth/login`, userInfo);
const changeDefaultPassword = async (userId, userInfo) =>
  await axios.patch(`auth/change-default-password/${userId}`, userInfo);

const refreshToken = async () => {
  let refreshToken = JSON.parse(localStorage.getItem("refreshToken"));
  if (!refreshToken) throw new Error("No refresh token found!");
  return await axios.post(`auth/refresh-token`, { refreshToken });
};

export { login, changeDefaultPassword, refreshToken };
