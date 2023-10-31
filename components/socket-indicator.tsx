"use client";

import { useSocket } from "@/components/providers/socket-provider";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();

  return (
    <div 
      className={`w-4 h-4 rounded-full ${isConnected ? "bg-emerald-600" : "bg-yellow-600"}`}
      title={isConnected ? "Connected" : "Not Connected"}
    ></div>
  )
}
