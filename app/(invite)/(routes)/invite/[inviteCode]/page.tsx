/**
 * @module page.tsx
 * @description This module provides a page component to handle invite codes for servers.
 * @requires @clerk/nextjs
 * @requires next/navigation
 * @requires @/lib/db
 * @requires @/lib/current-profile
 */

import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

/**
 * Props type for the InviteCodePage component.
 * @typedef {Object} InviteCodePageProps
 * @property {Object} params - Parameters passed to the component.
 * @property {string} params.inviteCode - The invite code for the server.
 */
interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
}

/**
 * InviteCodePage is an async component that handles invite codes.
 * 
 * It checks if the current user's profile has already joined a server using the provided invite code.
 * If the profile has joined, it redirects to that server's page.
 * Otherwise, it joins the server and then redirects to that server's page.
 * 
 * @param {InviteCodePageProps} props - The props for the InviteCodePage component.
 * @returns {Promise<JSX.Element|null>} A promise that resolves to a redirection or null.
 */
const InviteCodePage = async ({
  params
}: InviteCodePageProps): Promise<JSX.Element|null> => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  if (!params.inviteCode) {
    return redirect("/");
  }

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  });

  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }

  const server = await db.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          }
        ]
      }
    }
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }
  
  return null;
}

export default InviteCodePage;
