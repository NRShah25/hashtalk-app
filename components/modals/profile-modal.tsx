"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { ScrollArea } from "@/components/ui/scroll-area";

type Profile = {
  id: string;
  username: string;
  imageUrl: string;

  displayName: string;
  about: string;
  status: string;
}

type ProfileModalProps = {
  profileId: string;
}

export const ProfileModal = ({ profileId }: ProfileModalProps) => {
  const { isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && type === "profile";
  const [profile, setProfile] = useState<Profile>();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const fetchProfile = async () => {
      if (!profileId) return;

      try {
        const response = await fetch('/api/profiles/[profileId]');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        let profile: Profile = await response.json();

        setProfile(profile);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

fetchProfile();

}, [profileId]);

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            {profile?.username}
          </DialogTitle>
          <DialogDescription 
            className="text-center text-zinc-500"
          >
            {profile?.status}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          "Hi"
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}