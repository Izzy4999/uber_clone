// SocketProvider.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import * as TaskManager from "expo-task-manager";
import { useAuth } from "@clerk/clerk-react";

const SOCKET_URL = "http://192.168.0.130:6000"; // Update with your Socket.io server URL

// Create a context with Socket type or null
const SocketContext = createContext<Socket | null>(null);

interface SocketProviderProps {
  children: ReactNode;
}

export const LOCATION_TASK_NAME = "background-location-task";

// Define the background task

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      const newSocket = io(SOCKET_URL, {
        transports: ["websocket"],
        reconnectionAttempts: 10,
        reconnectionDelay: 3500,
      });
      setSocket(newSocket);

      // TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
      //     if (error) {
      //       console.error("Background location task error:", error);
      //       return;
      //     }
      //     if (data) {
      //       const { locations } = data as any;
      //       // Get the latest location from the array of locations
      //       const latestLocation = locations[locations.length - 1];
      //       if (latestLocation) {
      //         console.log("Background location update:", latestLocation);
      //         // Emit location update via Socket.io
      //         newSocket.emit("update-location", {
      //           latitude: latestLocation.coords.latitude,
      //           longitude: latestLocation.coords.longitude,
      //         });
      //       }
      //     }
      //   });

      newSocket.on("connect", () => {
        console.log("Socket connected:", newSocket.id);
      });

      // Clean up the socket connection when the provider unmounts
      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error.message);
      });

      newSocket.on("disconnect", (reason) => {
        console.warn("Socket disconnected:", reason);
      });
      return () => {
        newSocket.disconnect();
        setSocket(null);
      };
    }
  }, [isSignedIn]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

// Custom hook to use the socket
export const useSocket = (): Socket => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
