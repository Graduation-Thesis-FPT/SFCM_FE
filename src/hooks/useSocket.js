import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const DEFAULT_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3050";

export const useSocket = (serverUrl = DEFAULT_URL) => {
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io(serverUrl);
    return () => {
      if (socket && socket.current) {
        socket.current.removeAllListeners();
        socket.current.close();
      }
    };
  }, [serverUrl]);

  return socket.current;
};
