import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

import { ScrollArea } from "@/components/ui/scroll-area";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";

import { NavigationAction } from "./navigation-action";
import { NavigationItem } from "./navigation-item";

export const NavigationSidebar = async () => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  });

  return (
    <div
      className="space-x-4 flex flex-row items-center w-full h-auto text-primary dark:bg-[#1E1F22] bg-[#E3E5E8] py-3 px-4"
    >
      <div className="flex items-center flex-row gap-x-4">
        <NavigationAction />
      </div>
      <Separator
        className="w-[2px] h-full bg-zinc-300 dark:bg-zinc-700 rounded-md mx-auto"
      />
      <ScrollArea className="flex-1 h-full">
        <div className="flex flex-row items-center gap-x-4">
          {servers.map((server) => (
            <div key={server.id} className="mr-4">
              <NavigationItem
                id={server.id}
                name={server.name}
                imageUrl={server.imageUrl}
              />
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="flex items-center flex-row gap-x-4">
        <ModeToggle />
      </div>
      <UserButton
        afterSignOutUrl="/"
        appearance={{
          elements: {
            avatarBox: "h-[48px] w-[48px]"
          }
        }}
      />
    </div>
  );
};