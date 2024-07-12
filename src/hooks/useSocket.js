import { useEffect, useState } from "react";
import io from "socket.io-client";

const DEFAULT_URL = "http://localhost:3050";

export const useSocket = (serverUrl = DEFAULT_URL) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to the Socket.IO server
    const newSocket = io(import.meta.env.VITE_SERVER_URL || "http://localhost:3050");
    setSocket(newSocket);

    return () => newSocket.close();
  }, []); // Chỉ tạo mới socket khi serverUrl thay đổi

  return socket;
};
