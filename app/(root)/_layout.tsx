import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { io } from "socket.io-client";

// const SOCKET_URL = "http://192.168.88.52:6000";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="find-ride" options={{ headerShown: false }} />
      <Stack.Screen name="confirm-ride" options={{ headerShown: false }} />
      <Stack.Screen name="book-ride" options={{ headerShown: false }} />
      <Stack.Screen name="view-requests" options={{ headerShown: false }} />
    </Stack>
  );
}
