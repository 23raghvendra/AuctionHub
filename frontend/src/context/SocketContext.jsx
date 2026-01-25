import React, { createContext, useContext, useEffect, useMemo } from "react";
import io from "socket.io-client";
import { API_BASE_URL } from "@/config/api";

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const socket = useMemo(
        () =>
            io(API_BASE_URL, {
                withCredentials: true,
                transports: ["websocket"],
            }),
        []
    );

    useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected to socket server");
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from socket server");
        });

        return () => {
            socket.disconnect();
        };
    }, [socket]);

    return (
        <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
    );
};

