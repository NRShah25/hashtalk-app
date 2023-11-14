/**
 * @module page.tsx
 * @description This module provides a page component for user initial setup.
 * @requires next/navigation
 * @requires @/lib/db
 * @requires @/lib/initial-profile
 * @requires @/components/modals/initial-modal
 */

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { InitialModal } from "@/components/modals/initial-modal";
import { ExploreModal } from "@/components/modals/explore-modal";

/**
 * SetupPage is an async component responsible for the initial setup of users.
 * 
 * It checks if the current user's profile is associated with any server.
 * If the user is already a member of a server, it redirects them to that server.
 * If not, it displays the InitialModal for further setup actions.
 * 
 * @returns {Promise<JSX.Element|null>} A promise that resolves to the initial setup layout or a redirection.
 */
const SetupPage = async (): Promise<JSX.Element|null> => {
  const profile = await initialProfile();

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return <InitialModal />;
}

export default SetupPage;
