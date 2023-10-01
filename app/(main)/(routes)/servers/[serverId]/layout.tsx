import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { ServerSidebar } from "@/components/server/server-sidebar";

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
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
    <div className="w-full mt-[-65px]">
      <div 
      className="hidden md:flex w-full h-16 z-20 fixed inset-x-0">
        <ServerSidebar serverId={params.serverId} />
      </div>
      <main className="w-full mt-16">
        {children}
      </main>
    </div>
   );
}
 
export default ServerIdLayout;
