import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { ServerSidebar } from "@/components/server/server-sidebar";

interface ServerIdLayoutProps {
  children: React.ReactNode; 
  params: { serverId: string };
}

/**
 * Fetches the authenticated user's profile.
 * If the user is not authenticated, it redirects them to sign in.
 *
 * @returns {null | object} Returns the user's profile if it exists, otherwise null.
 */
const fetchAuthenticatedProfile = async () => {
  const profile = await currentProfile();
  if (!profile) {
    redirectToSignIn();
    return null;
  }
  return profile;
}

/**
 * Fetches the server details for a given profile and server ID.
 *
 * @param {string} serverId - The ID of the server.
 * @param {string} profileId - The ID of the user's profile.
 * @returns {object | null} Returns server details if found, otherwise null.
 */
const fetchServerForProfile = async (serverId: string, profileId: string) => {
  return await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profileId
        }
      }
    }
  });
}

/**
 * The main ServerIdLayout component.
 * It acts as a layout wrapper for content related to a specific server.
 * - First, it checks if the user is authenticated and fetches their profile.
 * - Then, it retrieves the server details using the provided server ID.
 * - If the user is not a member of the server or if the server does not exist, they're redirected to the home page.
 * - Finally, the layout along with the child components is rendered.
 *
 * @param {ServerIdLayoutProps} { children, params } - Properties passed to the component.
 */
const ServerIdLayout: React.FC<ServerIdLayoutProps> = async ({ children, params }) => {
  const profile = await fetchAuthenticatedProfile();
  if (!profile) return null;

  const server = await fetchServerForProfile(params.serverId, profile.id);
  if (!server) {
    redirect("/");
    return null;
  }

  return (
      <div className="flex flex-col h-screen">
        <div className="hidden md:flex h-16 z-20 fixed inset-x-0">
          <ServerSidebar serverId={params.serverId} />
        </div>
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
  );
}

export default ServerIdLayout;