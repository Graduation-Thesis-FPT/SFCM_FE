import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9900";

export default axios.create({
  baseURL: BASE_URL + "/api/v1",
  headers: { "Content-Type": "application/json" },
  withCredentials: false
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true
});
