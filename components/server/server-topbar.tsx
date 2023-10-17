import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";

import { ServerHeader } from "@/components/server/server-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ServerSearch } from "@/components/server/server-search";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { ServerImage } from "@/components/server/server-image";
import { ServerToolbar } from "./server-toolbar";

interface ServerTopbarProps {
    serverId: string;
}

const iconMap = {
    [ChannelType.TEXT]: <Hash className = "mr-2 h-4 w-4" />,
    [ChannelType.AUDIO]: <Mic className = "mr-2 h-4 w-4" />,
    [ChannelType.VIDEO]: <Video className = "mr-2 h-4 w-4" />
};

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className = "h-4 w-4 mr-2 text-indigo-500" />,
    [MemberRole.ADMIN]: <ShieldAlert className = "h-4 w-4 mr-2 text-rose-500" />
}

export const ServerTopbar = async ({
    serverId
  }: ServerTopbarProps) => {
    const profile = await currentProfile();
  
    if (!profile) {
      return redirect("/");
    }

    const server = await db.server.findUnique({
        where: {
            id: serverId,
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: "asc",
                },
            },
            members: {
                include: {
                    profile: true,
                },
                orderBy: {
                    role: "asc",
                }
            }
        }
    });

    const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT)
    const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO)
    const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO)
    const members = server?.members.filter((member) => member.profileId !== profile.id)

    if (!server) {
        return redirect("/");
    }

    const role = server.members.find((member) => member.profileId === profile.id)?.role;

    return (
        <div className="flex h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
            <div className="flex-1" style={{flex: 0.25}}>
                <ServerImage 
                    id={""} 
                    imageUrl={server.imageUrl} 
                    name={""} 
                />
            </div>
            <div className="flex-2" style={{flex: 7.75}}>
                <ServerHeader 
                    server={server}
                    role={role}
                /> 
            </div>
            <div className="flex-3" style={{flex: 1.25}}>
                <ServerToolbar 
                    server={server}
                    role={role}
                /> 
            </div>
        </div>
    )
    
}