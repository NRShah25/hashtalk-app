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

  return (
    <div>
      <div className="w-full text-md font-semibold px-3 py-3 flex items-center border-neutral-200 dark:border-neutral-800 border-b-2 transition">
          <Image src={server.imageUrl} alt={server.name} width={48} height={48} className="rounded-full mr-2" />
          {server.name}
      </div>
    </div>
  )
}
