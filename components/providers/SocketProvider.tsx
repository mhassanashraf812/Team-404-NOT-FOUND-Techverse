"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState, createContext, useContext } from "react";
import io from "socket.io-client";
import { ToastSuccessMessage } from "../ui/toast-messages";

interface SocketContextType {
  refreshMessage: number;
  setRefreshMessage: React.Dispatch<React.SetStateAction<number>>;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { data: session }: any = useSession();
  const socket = io(`http://localhost:4000`);
  const [refreshMessage, setRefreshMessage] = useState(1);

  useEffect(() => {
    if (session) {
      socket.emit("join", `${session?.user?.id}`);
      socket.on("message", (message) => {
        ToastSuccessMessage(message);
        new Notification(message);
        setRefreshMessage((prev) => prev + 1);
      });

      return () => {
        socket.off("message");
      };
    }
  }, [session]);

  useEffect(() => {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
    } else {
      Notification.requestPermission();
    }
  }, [session]);

  return (
    <SocketContext.Provider value={{ refreshMessage, setRefreshMessage }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
