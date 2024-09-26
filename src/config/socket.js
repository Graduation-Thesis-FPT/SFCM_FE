import { io } from "socket.io-client";

let URL = import.meta.env.VITE_BASE_URL || "http://localhost:3050";

export const socket = io(URL, {
  autoConnect: false
});
