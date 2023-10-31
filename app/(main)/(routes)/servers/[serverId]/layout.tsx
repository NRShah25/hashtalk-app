/**
 * @module layout.tsx
 * @description This module provides a layout component for displaying server-specific content, including a server sidebar.
 * @requires @clerk/nextjs
 * @requires next/navigation
 * @requires @/lib/db
 * @requires @/lib/current-profile
 * @requires @/components/server/server-sidebar
 */

import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { ServerSidebar } from "@/components/server/server-sidebar";

/**
 * Props type for the ServerIdLayout component.
 * @typedef {Object} ServerIdLayoutProps
 * @property {React.ReactNode} children - Child components to be rendered in the main content area.
 * @property {Object} params - Parameters passed to the component.
 * @property {string} params.serverId - The ID of the server.
 */
interface ServerIdLayoutProps {
  children: React.ReactNode;
  params: {
    serverId: string;
  };
}

/**
 * ServerIdLayout is an async component that handles the layout for server-specific content.
 * 
 * It fetches the current user's profile and ensures they are a member of the specified server.
 * The layout consists of a server sidebar on the left and a main content area on the right.
 * 
 * @param {ServerIdLayoutProps} props - The props for the ServerIdLayout component.
 * @returns {Promise<JSX.Element|null>} A promise that resolves to the server layout or a redirection.
 */
const ServerIdLayout = async ({
  children,
  params,
}: ServerIdLayoutProps): Promise<JSX.Element|null> => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  });

  if (!server) {
    return redirect("/");
  }

  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSidebar serverId={params.serverId} />
      </div>
      <main className="h-full md:pl-60">
        {children}
      </main>
    </div>
  );
}

export default ServerIdLayout;