import { refreshToken } from "@/apis/access.api";
import {
  getAccessToken,
  getRefreshToken,
  removeRefreshAndAccessToken,
  storeAccessToken,
  storeRefreshToken
} from "@/lib/auth";
import { setUser } from "@/redux/slice/userSlice";
import { store } from "@/redux/store";
import Axios from "axios";
import { jwtDecode } from "jwt-decode";
import { setupCache, buildWebStorage } from "axios-cache-interceptor";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3050";

const axios = Axios.create({
  baseURL: BASE_URL + "/api/v1",
  headers: { "Content-Type": "application/json" },
  withCredentials: false
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL + "/api/v1",
  headers: { "Content-Type": "application/json" },
  withCredentials: true
});
export const axiosCache = setupCache(axiosPrivate, {
  ttl: 0,
  storage: buildWebStorage(sessionStorage, "axios-cache:")
});

axiosPrivate.interceptors.request.use(
  async config => {
    try {
      const token = getAccessToken();
      const rtoken = getRefreshToken();
      const decodedRToken = jwtDecode(rtoken);
      if (decodedRToken.exp < Date.now() / 1000) {
        removeRefreshAndAccessToken();
        window.location.href = "/login";
        return;
      }
      const pathname = window.location.pathname;
      const menuCode = pathname.split("/")[2];

      config.headers["token"] = token;
      config.headers["rtoken"] = rtoken;
      config.headers["menu-code"] = menuCode;

      return config;
    } catch (error) {
      removeRefreshAndAccessToken();
      window.location.href = "/login";
    }
  },
  error => {
    return Promise.reject(error);
  }
);

axiosPrivate.interceptors.response.use(
  response => response,
  async error => {
    const prevRequest = error?.config;
    if (
      (error?.response?.status === 403 || error?.response?.status === 401) &&
      !prevRequest?.sent
    ) {
      prevRequest.sent = true;
      const result = await refreshToken();
      storeAccessToken(result.data.metadata.accessToken);
      storeRefreshToken(result.data.metadata.refreshToken);
      store.dispatch(setUser(result.data.metadata));
      prevRequest.headers["token"] = result.data.metadata.accessToken;

      return axiosPrivate(prevRequest);
    }
    if (
      error?.response?.status === 400 &&
      error?.response?.data?.message === "Tài khoản đã bị khóa"
    ) {
      removeRefreshAndAccessToken();
      window.location.href = "/login";
      return;
    }
    return Promise.reject(error);
  }
);

export default axios;
