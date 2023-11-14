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
import { Hash } from "lucide-react";

type Server = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  inviteCode: string;
  profileId: string;
  createdAt: Date;
  updatedAt: Date;
};

export const SearchModal = () => {
  const { isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && type === "search";

  const [servers, setServers] = useState<Server[]>([]);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const response = await fetch('/api/servers');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const serverList = await response.json();
        setServers(serverList);
      } catch (error) {
        console.error('Error fetching servers:', error);
      }
    };

    fetchServers();
  }, []);

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">Search</DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {servers.map((server) => (
            <div key = {server.id} className = "flex items-center gap-x-2 mb-6">
              <ServerAvatar src = {server.imageUrl} />
              <div className = "flex flex-col gap-y-1">
                <div className = "text-xl font-semibold flex items-center">
                  <Hash/>
                  {server.name}
                </div>
                <div className = "text-xs flex items-center">
                  {server.description}
                </div>
                <p>
                  Member Count
                </p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};