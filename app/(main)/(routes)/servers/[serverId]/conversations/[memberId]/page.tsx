/**
 * @module page.tsx
 * @description This module provides a page component for displaying direct conversations between server members.
 * @requires @clerk/nextjs
 * @requires next/navigation
 * @requires @/lib/db
 * @requires @/lib/current-profile
 * @requires @/lib/conversation
 * @requires @/components/chat/chat-header
 * @requires @/components/chat/chat-input
 * @requires @/components/chat/chat-messages
 */

import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

/**
 * Props type for the MemberIdPage component.
 * @typedef {Object} MemberIdPageProps
 * @property {Object} params - Parameters passed to the component.
 * @property {string} params.memberId - The ID of the member.
 * @property {string} params.serverId - The ID of the server.
 */
interface MemberIdPageProps {
    params: {
        memberId: string;
        serverId: string;
    }
}

/**
 * MemberIdPage is an async component that handles the display and interactivity of a direct conversation.
 * It fetches details about the current member, the other member involved in the conversation, and the conversation itself.
 * The component renders the chat header, chat messages, and chat input for the specified conversation.
 * 
 * @param {MemberIdPageProps} props - The props for the MemberIdPage component.
 * @returns {Promise<JSX.Element|null>} A promise that resolves to the direct conversation layout or a redirection.
 */
const MemberIdPage = async ({
    params
}: MemberIdPageProps): Promise<JSX.Element|null> => {
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
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader
                imageUrl={otherMember.profile.imageUrl}
                name={otherMember.profile.username}
                serverId={params.serverId}
                type="conversation"
                status={otherMember.profile.status}
            />
            <ChatMessages 
                member={currentMember}
                name={otherMember.profile.username}
                chatId={conversation.id}
                type="conversation"
                apiUrl="/api/direct-messages"
                socketUrl="/api/socket/direct-messages"
                socketQuery={{
                    conversationId: conversation.id,
                }}
                paramKey="conversationId"
                paramValue={conversation.id}
            />
            <ChatInput 
                name={otherMember.profile.username}
                type="conversation"
                apiUrl="/api/socket/direct-messages"
                query={{
                    conversationId: conversation.id,
                }}
            />
        </div>
    );
}

export default MemberIdPage;