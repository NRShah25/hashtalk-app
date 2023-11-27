"use client"

import { useState } from "react";
import { Profile } from "@prisma/client";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "../user-avatar";

export const ProfileModal = () => {
  const router = useRouter();
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const [loadingId, setLoadingId] = useState("");

  const isModalOpen = isOpen && type === "profile";
  const { profile, isAuthenticated } = data as { profile: Profile; isAuthenticated?: boolean };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            <div className="flex items-center justify-center space-x-2">
              <UserAvatar src={profile?.imageUrl}/>
              <span>
                {profile?.displayName}
                {profile?.displayName !== profile?.username && ` (${profile?.username})`}
              </span>
            </div>
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            "{profile?.status}"
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {isAuthenticated && <div>Welcome to your profile!</div>}
          <div className="p-4">
            <div><strong>About me:</strong> {profile?.about}</div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}