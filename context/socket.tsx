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

const SOCKET_URL = "http://192.168.88.52:6000"; // Update with your Socket.io server URL

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

      // Clean up the socket connection when the provider unmounts
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
