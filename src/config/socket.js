import { io } from "socket.io-client";

let URL = import.meta.env.VITE_BASE_URL || "http://localhost:3050";

if (URL.startsWith("https")) {
  URL += ":443";
}

export const socket = io(URL, {
  autoConnect: false
});
