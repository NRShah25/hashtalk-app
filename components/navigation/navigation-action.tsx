"use client";

/**
 * @module navigation-action.tsx
 * @description This module provides a component to display an action button for adding servers.
 * @requires lucide-react
 * @requires @/components/action-tooltip
 * @requires @/hooks/use-modal-store
 */

import { Compass, PlusCircle, UserCircle } from "lucide-react";
import { ActionTooltip } from "@/components/action-tooltip";
import { useModal } from "@/hooks/use-modal-store";
import { Profile } from "@prisma/client";

interface NavigationActionProps {
    profile: Profile;
    isAuthenticated: boolean;
}

export const NavigationAction = ({ profile, isAuthenticated }: NavigationActionProps) => {
    const { onOpen } = useModal();

    const handleOpenProfileModal = () => {
        if (isAuthenticated && profile) {
            onOpen("profile", { profile, isAuthenticated: true });
        } else {
            console.log("User is not authenticated or profile not loaded.");
        }
    };

    return (
        <div>
            <ActionTooltip
                side="right"
                align="center"
                label="Profile"
            >
                <button
                    onClick={handleOpenProfileModal}
                    className="group flex items-center"
                >
                    <div className="flex mx-3 h-[48px] w-[48px] transition-all items-center justify-center">
                        <UserCircle
                            className="group-hover:text-white transition text-zinc-500 dark:text-zinc-400"
                            size={25}
                        />
                    </div>
                </button>
            </ActionTooltip>
            <ActionTooltip
                side="right"
                align="center"
                label="Explore"
            >
                <button
                    onClick={() => onOpen("explore")}
                    className="group flex items-center"
                >
                    <div className="flex mx-3 h-[48px] w-[48px] transition-all items-center justify-center">
                        <Compass
                            className="group-hover:text-white transition text-zinc-500 dark:text-zinc-400"
                            size={25}
                        />
                    </div>
                </button>
            </ActionTooltip>
            <ActionTooltip
                side="right"
                align="center"
                label="Create Server"
            >
                <button
                    onClick={() => onOpen("createServer")}
                    className="group flex items-center"
                >
                    <div className="flex mx-3 h-[48px] w-[48px] transition-all items-center justify-center">
                        <PlusCircle
                            className="group-hover:text-white transition text-zinc-500 dark:text-zinc-400"
                            size={25}
                        />
                    </div>
                </button>
            </ActionTooltip>
        </div>
    );
}
