import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace(/\/api$/, "") || "http://localhost:5000";

export function SocketProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || !user?._id) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const s = io(SOCKET_URL, {
      auth: { userId: user._id },
      transports: ["websocket", "polling"]
    });

    s.on("application:status", (data) => {
      toast.info(`Application update: ${data.jobTitle} — ${data.status}`);
    });

    s.on("interview:scheduled", (data) => {
      toast.success(`Interview scheduled: ${data.jobTitle} on ${data.date} at ${data.time}`);
    });

    s.on("interview:cancelled", (data) => {
      toast.warning(`Interview cancelled: ${data.jobTitle} on ${data.date}`);
    });

    setSocket(s);
    return () => s.disconnect();
  }, [isAuthenticated, user?._id]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
