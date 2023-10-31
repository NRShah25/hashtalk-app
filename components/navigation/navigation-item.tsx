"use client";

/**
 * @module navigation-item.tsx
 * @description This module provides a component for individual navigation items within the application's sidebar.
 * @requires next/image
 * @requires next/navigation
 * @requires @/lib/utils
 * @requires @/components/action-tooltip
 */

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/action-tooltip";

/**
 * Interface defining the properties for the NavigationItem component.
 * 
 * @interface
 * @property {string} id - The unique identifier for the navigation item.
 * @property {string} imageUrl - The URL for the image representing the navigation item.
 * @property {string} name - The name of the navigation item.
 */
interface NavigationItemProps {
  id: string;
  imageUrl: string;
  name: string;
}

/**
 * Represents an individual navigation item within the application's sidebar.
 * 
 * This component renders a navigation item with an associated image and tooltip. 
 * Clicking the item redirects the user to the respective server page.
 * 
 * @param {NavigationItemProps} props - The properties for the NavigationItem component.
 * @returns {React.ReactNode} Returns the structured layout of the navigation item.
 */
export const NavigationItem = ({ id, imageUrl, name }: NavigationItemProps) => {
  const params = useParams();
  const router = useRouter();

  /**
   * Event handler for when the navigation item is clicked. 
   * Redirects to the server page associated with the navigation item's id.
   */
  const onClick = () => {
    router.push(`/servers/${id}`);
  }

  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button onClick={onClick} className="group relative flex items-center">
        <div className={cn(
          "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] transition-all overflow-hidden",
          params?.serverId === id && "bg-primary/10 text-primary"
        )}>
          <Image fill src={imageUrl} alt="Channel" />
        </div>
      </button>
    </ActionTooltip>
  )
}