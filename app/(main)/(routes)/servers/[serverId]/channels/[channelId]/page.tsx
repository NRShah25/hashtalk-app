import { ChatHeader } from "@/components/chat/chat-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { SendHorizonal } from "lucide-react";
import { redirect } from "next/navigation";

interface ChannelIdPageProps {
    params: {
        serverId: string;
        channelId: string;
    }
}

const ChannelIdPage = async ({
    params
}: ChannelIdPageProps) => {
    const profile = await currentProfile();

    if (!profile) {
        return redirectToSignIn();
    }

    const channel = await db.channel.findUnique({
        where: {
            id: params.channelId,
        },
    });

    const member = await db.member.findFirst({
        where: {
            serverId: params.serverId,
            profileId: profile.id,
        }
    });

    if (!channel || !member) {
        redirect("/");
    }

    return (
        <div className="flex flex-col h-screen">
            <div className=" bg-white dark:bg-[#313338] flex flex-col h-full">
                <ChatHeader
                    name = {channel.name}
                    serverId={channel.serverId}
                    type="channel"
                />
            </div>
            <div className="flex items-center space-x-2">
                <Textarea
                    placeholder="Type your message here."
                    style={{ width: '90%', height: '1.5rem', padding: '0.25rem', textAlign: 'left' }}
                />
                <Button className="h-8"><SendHorizonal /></Button>
            </div>
        </div>
    );
}

export default ChannelIdPage;