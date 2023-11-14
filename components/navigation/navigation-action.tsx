"use client";

/**
 * @module navigation-action.tsx
 * @description This module provides a component to display an action button for adding servers.
 * @requires lucide-react
 * @requires @/components/action-tooltip
 * @requires @/hooks/use-modal-store
 */

import { ArrowRightFromLine, Home, Search, Settings } from "lucide-react";
import { ActionTooltip } from "@/components/action-tooltip";
import { useModal } from "@/hooks/use-modal-store";

/**
 * Represents a button action to add servers.
 * 
 * This component displays a button with a plus icon, which allows users to add a server.
 * Clicking the button opens a modal dialog for server creation. The button also includes a tooltip for user guidance.
 * 
 * @returns {React.ReactNode} Returns the action button with associated tooltip.
 */
export const NavigationAction = () => {
    const { onOpen } = useModal();

    return (
        <div>
            <ActionTooltip
                side="right"
                align="center"
                label="Home"
            >
                <button
                    onClick={() => onOpen("createServer")}
                    className="group flex items-center"
                >
                    <div className="flex mx-3 h-[48px] w-[48px] transition-all items-center justify-center">
                        <Home
                            className="group-hover:text-white transition text-zinc-500 dark:text-zinc-400"
                            size={25}
                        />
                    </div>
                </button>
            </ActionTooltip>
            <ActionTooltip
                side="right"
                align="center"
                label="Search"
            >
                <button
                    onClick={() => onOpen("search")}
                    className="group flex items-center"
                >
                    <div className="flex mx-3 h-[48px] w-[48px] transition-all items-center justify-center">
                        <Search
                            className="group-hover:text-white transition text-zinc-500 dark:text-zinc-400"
                            size={25}
                        />
                    </div>
                </button>
            </ActionTooltip>
        </div>
    );
}
