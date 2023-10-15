import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { InitialModal } from "@/components/modals/initial-modal";

/**
 * The SetupPage component.
 * This component performs the following steps:
 * - Fetches the profile of the currently authenticated user.
 * - Checks if the user is already a member of any server.
 * - If the user is a member of a server, it redirects them to that server's page.
 * - If the user is not a member of any server, it shows an `InitialModal` for the user.
 */
const SetupPage = async () => {
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