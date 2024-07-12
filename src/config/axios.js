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
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3050";

export default axios.create({
  baseURL: BASE_URL + "/api/v1",
  headers: { "Content-Type": "application/json" },
  withCredentials: false
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL + "/api/v1",
  headers: { "Content-Type": "application/json" },
  withCredentials: true
});

axiosPrivate.interceptors.request.use(
  async config => {
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
      (error?.response?.status === 500 ||
        error?.response?.status === 403 ||
        error?.response?.status === 401) &&
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
    return Promise.reject(error);
  }
);
