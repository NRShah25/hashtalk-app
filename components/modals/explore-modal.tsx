"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { ServerAvatar } from "../server-avatar";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";

type Server = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  inviteCode: string;
  profileId: string;
  createdAt: Date;
  updatedAt: Date;

  _count: { members: number };
};

export const ExploreModal = () => {
  const { isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && type === "explore";
  const router = useRouter();
  const [servers, setServers] = useState<Server[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  const fetchServers = async () => {
    try {
      const response = await fetch('/api/servers');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      let serverList: Server[] = await response.json();

      serverList.sort((a, b) => b._count.members - a._count.members);

      setServers(serverList);
    } catch (error) {
      console.error('Error fetching servers:', error);
    }
};

fetchServers();

}, []);

const handleJoinServer = async (serverId: string) => {
  try {
    const response = await axios.post(`/api/servers/${serverId}/join`);
    
    if (response.status === 200) {
      router.push(`/servers/${serverId}`);
    } else {
      console.error('Server join was unsuccessful:', response.data.message);
    }
  } catch (error) {
    console.error('Error joining server:', error);
  }
};

return (
  <Dialog open={isModalOpen} onOpenChange={onClose}>
    <DialogContent className="bg-white text-black overflow-hidden">
      <DialogHeader className="pt-8 px-6">
        <DialogTitle className="text-2xl text-center font-bold">Explore</DialogTitle>
      </DialogHeader>
      <ScrollArea className="mt-8 max-h-[420px] pr-6">
        {servers.map((server) => (
          <div key={server.id} className="flex items-center justify-between gap-x-2 mb-6">
            <div className="flex items-center gap-x-2">
              <ServerAvatar src={server.imageUrl} />
              <div className="flex flex-col gap-y-1">
                <div className="font-semibold text-s flex items-baseline">
                  <span className="font-bold">{server.name}</span>
                  <span className="mx-2">•</span>
                  <span> {server._count.members} {server._count.members === 1 ? 'member' : 'members'}</span>
                </div>
                <span className="text-xs">{server.description}</span>
              </div>
            </div>
            <Button onClick={() => handleJoinServer(server.id)}>
              Join
            </Button>
          </div>
        ))}
      </ScrollArea>
    </DialogContent>
  </Dialog>
);
};