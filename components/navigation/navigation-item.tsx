"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/action-tooltip";

interface NavigationItemProps {
  id: string;
  imageUrl: string;
  name: string;
};

/**
 * NavigationItem function component.
 *
 * Renders a navigational item, visually represented by an image. The item has 
 * an associated tooltip that provides its name. The item becomes visually distinct 
 * if it corresponds to the currently viewed server.
 *
 * @param id - The server's unique identifier.
 * @param imageUrl - The server's associated image URL.
 * @param name - The server's name.
 *
 * @returns JSX.Element - The rendered component.
 */
export const NavigationItem = ({
  id,
  imageUrl,
  name
}: NavigationItemProps) => {
  const params = useParams();
  const router = useRouter();

  const onClick = () => {
    router.push(`/servers/${id}`);
  }

  return (
    <ActionTooltip
      side="bottom"
      align="center"
      label={name}
    >
      <button
        onClick={onClick}
        className="group relative flex items-center"
      >
        <div className={cn(
          "relative group flex mx-3 h-[48px] w-[48px] rounded-[32px] group-hover:rounded-[16px] transition-all overflow-hidden",
          params?.serverId === id && "bg-primary/10 text-primary rounded-[16px]"
        )}>
          <Image
            fill
            src={imageUrl}
            alt="Channel"
          />
        </div>
      </button>
    </ActionTooltip>
  );
}