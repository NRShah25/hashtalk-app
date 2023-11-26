import { MessagesSquare } from "lucide-react";
import { MobileToggle } from "../mobile-toggle";
import { UserAvatar } from "../user-avatar";
import { SocketIndicator } from "../socket-indicator";

interface ChatHeaderProps {
    serverId: string;
    name: string;
    type: "channel" | "conversation";
    imageUrl?: string;
    status?: string;
}

export const ChatHeader = ({
    serverId,
    name,
    type,
    imageUrl,
    status
}: ChatHeaderProps) => {
    return (
        <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
            <MobileToggle serverId={serverId}/>
            <div className="flex mr-2" style={{ width: '2rem', height: '2rem' }}>
                {type === "channel" && (
                    <MessagesSquare className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                )}
                {type === "conversation" && (
                    <UserAvatar
                        src={imageUrl}
                        className="h-8 w-8 md:h-8 md:w-8" 
                    />
                )}
            </div>
            <div className="flex flex-col mt-2 mr-4">
                <p className="font-semibold text-md text-black dark:text-white">
                    {name}  
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {status}
                </p>
            </div>
            <div className="ml-auto flex items-center">
                <SocketIndicator />
            </div>
        </div>
    )
}
