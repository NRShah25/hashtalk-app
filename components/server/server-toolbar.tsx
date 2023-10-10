"use client";

import { ServerWithMembersWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";
import { 
  ChevronDown, 
  DoorOpen, 
  LogOut, 
  MessageSquarePlus, 
  PlusCircle, 
  Settings, 
  Trash, 
  UserCog, 
  UserPlus,
  Users,
  XSquare
} from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
import { ActionTooltip } from "../action-tooltip";

interface ServerToolbarProps {
  server: ServerWithMembersWithProfiles;
  role?: MemberRole;
};

export const ServerToolbar = ({
  server,
  role
}: ServerToolbarProps) => {
  const { onOpen } = useModal();

  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  return (
    <div className="flex flex-row justify-center items-center h-full w-full">
      {isModerator && (
        <ActionTooltip side="bottom" align="center" label="Invite Code">
          <button onClick={() => onOpen("invite", { server })} className="mr-3 px-2 py-2 text-md">
            <UserPlus className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
          </button>
        </ActionTooltip>
      )}
      {isAdmin && (
        <ActionTooltip side="bottom" align="center" label="Edit Server">
          <button onClick={() => onOpen("editServer", { server })} className="mr-3 px-2 py-2 text-md">
            <Settings className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
          </button>
        </ActionTooltip>
      )}
      {isAdmin && (
        <ActionTooltip side="bottom" align="center" label="Manage Members">
          <button onClick={() => onOpen("members", { server })} className="mr-3 px-2 py-2 text-md">
            <UserCog className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
          </button>
        </ActionTooltip>
      )}
      {isModerator && (
        <ActionTooltip side="bottom" align="center" label="Create Channel">
          <button onClick={() => onOpen("createChannel")} className="mr-3 px-2 py-2 text-md">
            <MessageSquarePlus className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
          </button>
        </ActionTooltip>
      )}
      {isAdmin && (
        <ActionTooltip side="bottom" align="center" label="Delete Server">
          <button onClick={() => onOpen("deleteServer", { server })} className="mr-3 px-2 py-2 text-md">
            <XSquare className="h-6 w-6 text-rose-500" />
          </button>
        </ActionTooltip>
      )}
      {!isAdmin && (
        <ActionTooltip side="bottom" align="center" label="Leave Server">
          <button onClick={() => onOpen("leaveServer", { server })} className="px-2 py-2 text-md">
            <DoorOpen className="h-6 w-6 text-rose-500" />
          </button>
        </ActionTooltip>
      )}
    </div>
  )
}

