/**
 * @module server-header.tsx
 * @description This module provides a component for displaying the header of a server.
 * @requires next/image
 * @requires @/types
 * @requires @prisma/client
 */

"use client";

import Image from "next/image";
import { ServerWithMembersWithProfiles } from "@/types";
import { ActionTooltip } from "../action-tooltip";
import { Cog, DoorOpen, Settings } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

/**
 * Interface defining the properties for the ServerHeader component.
 * 
 * @interface
 * @property {ServerWithMembersWithProfiles} server - The server details including members and profiles.
 */
interface ServerHeaderProps {
  server: ServerWithMembersWithProfiles;
}

/**
 * Represents the header of a server.
 * 
 * This component displays the server name and its associated image in the header section. 
 * 
 * @param {ServerHeaderProps} props - The properties for the ServerHeader component.
 * @returns {React.ReactNode} Returns the structured layout of the server header.
 */
export const ServerHeader = ({ server }: ServerHeaderProps) => {
  const { onOpen } = useModal();

  return (
    <div>
      <div className="w-full px-3 py-3 border-neutral-200 dark:border-neutral-800 border-b-2 transition flex flex-col">
        <div className="flex items-center mb-2">
          <Image src={server.imageUrl} alt={server.name} width={48} height={48} className="rounded-full mr-2" />
          <div className="text-md font-semibold">{server.name}</div>
        </div>
        <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">{server.description}</div>
        
        <div className="flex justify-center space-x-2">
        <ActionTooltip label = "Edit Server" side = "bottom">
            <button 
            onClick = {() => onOpen("editServer", {server})}
                className = "text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition">
                <Settings className = "h-6 w-6" />
            </button>
          </ActionTooltip>
          <ActionTooltip label = "Leave Server" side = "bottom">
            <button 
            onClick = {() => onOpen("leaveServer", {server})}
                className = "text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition">
                <DoorOpen className = "h-6 w-6 text-rose-400" />
            </button>
          </ActionTooltip>
        </div>
      </div>
    </div>
  );
    
}
