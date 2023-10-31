/**
 * @module page.tsx
 * @description This module provides a page component for displaying chat channels.
 * @requires @clerk/nextjs
 * @requires next/navigation
 * @requires @/lib/db
 * @requires @/lib/current-profile
 * @requires @/components/chat/chat-header
 * @requires @/components/chat/chat-input
 * @requires @/components/chat/chat-messages
 */

import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

/**
 * Props type for the ChannelIdPage component.
 * @typedef {Object} ChannelIdPageProps
 * @property {Object} params - Parameters passed to the component.
 * @property {string} params.serverId - The ID of the server.
 * @property {string} params.channelId - The ID of the chat channel.
 */
interface ChannelIdPageProps {
    params: {
        serverId: string;
        channelId: string;
    }
}

/**
 * ChannelIdPage is an async component that handles the display and interactivity of a specific chat channel.
 * It fetches the current user's profile, the specific channel details, and membership status of the user in the server.
 * The component renders the chat header, chat messages, and chat input for the specified channel.
 * 
 * @param {ChannelIdPageProps} props - The props for the ChannelIdPage component.
 * @returns {Promise<JSX.Element|null>} A promise that resolves to the chat channel layout or a redirection.
 */
const ChannelIdPage = async ({
    params
}: ChannelIdPageProps): Promise<JSX.Element|null> => {
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
        return redirect("/");
    }

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader
                name={channel.name}
                serverId={channel.serverId}
                type="channel"
            />
            <ChatMessages 
                member={member}
                name={channel.name}
                chatId={channel.id}
                type="channel"
                apiUrl="/api/messages"
                socketUrl="/api/socket/messages"
                socketQuery={{
                    channelId: channel.id,
                    serverId: channel.serverId,
                }}
                paramKey="channelId"
                paramValue={channel.id}
            />
            <ChatInput 
                name={channel.name}
                type="channel"
                apiUrl="/api/socket/messages"
                query={{
                    channelId: channel.id,
                    serverId: channel.serverId,
                }}
            />
        </div>
    );
}

export default ChannelIdPage;