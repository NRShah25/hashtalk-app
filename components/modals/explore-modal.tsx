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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Profile } from "@prisma/client";

type Server = {
  id: string;
  name: string;
  description: string;
  accessLevel: 'PUBLIC' | 'PRIVATE';
  imageUrl: string;
  profileId: string;

  _count: { members: number };
};

export const ExploreModal = () => {
  const { onOpen, isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && type === "explore";
  const router = useRouter();
  const [servers, setServers] = useState<Server[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
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
    
        serverList = serverList.filter(server => server.accessLevel === 'PUBLIC');
    
        serverList.sort((a, b) => b._count.members - a._count.members);
    
        setServers(serverList);
      } catch (error) {
        console.error('Error fetching servers:', error);
      }
    };

    const fetchProfiles = async () => {
      try {
        const response = await fetch('/api/profiles');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        let profileList: Profile[] = await response.json();

        setProfiles(profileList);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    };

fetchServers();
fetchProfiles();

}, []);

const handleJoinServer = async (serverId: string) => {
  try {
    const response = await axios.post(`/api/servers/${serverId}/join`);
    
    if (response.status === 200) {
      router.push(`/servers/${serverId}`);
      onClose();
    } else {
      console.error('Server join was unsuccessful:', response.data.message);
    }
  } catch (error) {
    console.error('Error joining server:', error);
  }
};

const handleViewProfile = (profile: Profile) => {
  onOpen("profile", { profile });
};

return (
  <Dialog open={isModalOpen} onOpenChange={onClose}>
    <DialogContent className="bg-white text-black overflow-hidden">
      <DialogHeader className="pt-8 px-6">
        <DialogTitle className="text-2xl text-center font-bold">Explore</DialogTitle>
      </DialogHeader>
      <Tabs defaultValue="servers">
        <TabsList className="flex justify-center">
          <TabsTrigger value="servers">Servers</TabsTrigger>
          <TabsTrigger value="profiles">Profiles</TabsTrigger>
        </TabsList>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
        <TabsContent value="servers">
            {servers.map((server) => (
              <div key={server.id} className="flex items-center justify-between gap-x-2 mb-6">
                <div className="flex items-center gap-x-2">
                  <ServerAvatar src={server.imageUrl} />
                  <div className="flex flex-col gap-y-1">
                    <div className="font-semibold text-s flex items-baseline">
                      <span className="font-bold">{server.name}</span>
                    </div>
                    <span className = "text-xs"> {server._count.members} {server._count.members === 1 ? 'member' : 'members'}</span>
                    <span className="text-xs">{server.description}</span>
                  </div>
                </div>
                <Button onClick={() => handleJoinServer(server.id)}>
                  Join
                </Button>
              </div>
            ))}
        </TabsContent>
        </ScrollArea>
        <TabsContent value="profiles">
          <ScrollArea className="mt-8 max-h-[420px] pr-6">
              {profiles.map((profile) => (
                <div key={profile.id} className="flex items-center justify-between gap-x-2 mb-6">
                  <div className="flex items-center gap-x-2">
                    <ServerAvatar src={profile.imageUrl} />
                    <div className="flex flex-col gap-y-1">
                      <div className="font-semibold text-s flex items-baseline">
                      {profile.displayName === profile.username ? profile.displayName : `${profile.displayName} (${profile.username})`}
                      </div>
                      <span className="text-xs">{profile.about}</span>
                    </div>
                  </div>
                  <Button onClick={() => handleViewProfile(profile)}>
                    View
                  </Button>
                </div>
              ))}
            </ScrollArea>
        </TabsContent>
      </Tabs>
    </DialogContent>
  </Dialog>
);
};