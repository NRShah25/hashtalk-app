import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
};

/**
 * Redirect the user to the sign-in page if they don't have a profile.
 *
 * @returns {null | object} Returns the profile if it exists, otherwise null.
 */
const redirectIfNoProfile = async () => {
  const profile = await currentProfile();
  if (!profile) {
    redirectToSignIn();
    return null;
  }
  return profile;
}

/**
 * Redirects to the home page if there's no invite code provided.
 *
 * @param {string} inviteCode - The code used to join a server.
 * @returns {boolean} Returns true if redirected, otherwise false.
 */
const redirectIfNoInviteCode = (inviteCode: string) => {
  if (!inviteCode) {
    redirect("/");
    return true;
  }
  return false;
}

/**
 * Checks if the user is already a member of the server. If so, redirect them.
 *
 * @param {string} inviteCode - The code used to join a server.
 * @param {string} profileId - The ID of the user's profile.
 * @returns {boolean} Returns true if user is already a member and redirected, otherwise false.
 */
const redirectIfMemberOfServer = async (inviteCode: string, profileId: string) => {
  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: inviteCode,
      members: {
        some: {
          profileId: profileId
        }
      }
    }
  });

  if (existingServer) {
    redirect(`/servers/${existingServer.id}`);
    return true;
  }
  return false;
}

/**
 * Main InviteCodePage component. It orchestrates the invitation flow:
 * - If the user is not authenticated, they are redirected to sign in.
 * - If there's no invite code, they are redirected to the home page.
 * - If they're already a member of the server associated with the invite code, they are redirected to that server's page.
 * - Otherwise, they're added as a member of the server and redirected accordingly.
 *
 * @param {InviteCodePageProps} { params: { inviteCode } } - Properties passed to the component.
 */
const InviteCodePage = async ({ params: { inviteCode } }: InviteCodePageProps) => {
  const profile = await redirectIfNoProfile();
  if (!profile) return;

  if (redirectIfNoInviteCode(inviteCode)) return;
  
  if (await redirectIfMemberOfServer(inviteCode, profile.id)) return;

  const server = await db.server.update({
    where: {
      inviteCode: inviteCode,
    },
    data: {
      members: {
        create: [{
          profileId: profile.id,
        }]
      }
    }
  });

  redirect(`/servers/${server.id}`);
  return null;
}

export default InviteCodePage;