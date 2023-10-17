import { ChatHeader } from "@/components/chat/chat-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { SendHorizonal } from "lucide-react";
import { redirect } from "next/navigation";

interface MemberIdPageProps {
    params: {
        memberId: string;
        serverId: string;
    }
}

const MemberIdPage = async ({
    params
}: MemberIdPageProps) => {
    const profile = await currentProfile();

    if (!profile) {
        return redirectToSignIn();
    }

    const currentMember = await db.member.findFirst({
        where: {
            serverId: params.serverId,
            profileId: profile.id,
        },
        include: {
            profile: true,
        },
    });

    if (!currentMember) {
        return redirect("/");
    }

    const conversation = await getOrCreateConversation(currentMember.id, params.memberId);

    if (!conversation) {
        return redirect(`/servers/${params.serverId}`);
    }

    const { memberOne, memberTwo } = conversation;

    const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;

    return (
        <div className="flex flex-col h-screen">
            <div className=" bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader
                    imageUrl = {otherMember.profile.imageUrl}
                    name = {otherMember.profile.name}
                    serverId = {params.serverId}
                    type = "conversation"
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

export default MemberIdPage;