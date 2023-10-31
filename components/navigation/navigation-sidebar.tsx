/**
 * @module navigation-sidebar.tsx
 * @description This module provides a component for the navigation sidebar of the application.
 * @requires next/navigation
 * @requires @clerk/nextjs
 * @requires @/components/ui/scroll-area
 * @requires @/components/mode-toggle
 * @requires @/components/ui/separator
 * @requires @/lib/current-profile
 * @requires @/lib/db
 * @requires ./navigation-action
 * @requires ./navigation-item
 */

import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

import { ScrollArea } from "@/components/ui/scroll-area";
import { ModeToggle } from "@/components/mode-toggle";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { NavigationAction } from "./navigation-action";
import { NavigationItem } from "./navigation-item";

/**
 * Represents the navigation sidebar of the application.
 * 
 * This component renders a sidebar for navigation purposes. It includes elements such as
 * a navigation action button, a mode toggle button, a user button, and a list of servers
 * for navigation.
 * 
 * @returns {React.ReactNode} Returns the structured layout of the navigation sidebar.
 */
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
      <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3">
            <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
                <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                        elements: {
                            avatarBox: "h-[48px] w-[48px]"
                        }
                    }}
                />
            <NavigationAction />
            </div>
            <ScrollArea className="flex-1 w-full">
                {servers.map((server) => (
                    <div key={server.id} className="mb-4">
                        <NavigationItem
                            id={server.id}
                            name={server.name}
                            imageUrl={server.imageUrl}
                        />
                    </div>
                ))}
            </ScrollArea>
            <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
              <ModeToggle />
            </div>
        </div>
    );
}