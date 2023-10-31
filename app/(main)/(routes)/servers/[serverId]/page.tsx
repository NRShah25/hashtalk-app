/**
 * @module page.tsx
 * @description This module provides a page component that redirects users to the initial channel of a specified server.
 * @requires @clerk/nextjs
 * @requires next/navigation
 * @requires @/lib/db
 * @requires @/lib/current-profile
 */

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

/**
 * Props type for the ServerIdPage component.
 * @typedef {Object} ServerIdPageProps
 * @property {Object} params - Parameters passed to the component.
 * @property {string} params.serverId - The ID of the server.
 */
interface ServerIdPageProps {
    params: {
        serverId: string;
    }
}

/**
 * ServerIdPage is an async component that redirects users to the initial channel of a specified server.
 * 
 * It first checks if the user is authenticated and a member of the server.
 * If the user is a member, it then looks for the initial channel and redirects to it.
 * 
 * @param {ServerIdPageProps} props - The props for the ServerIdPage component.
 * @returns {Promise<JSX.Element|null>} A promise that resolves to a redirection or null.
 */
const ServerIdPage = async ({
    params
}: ServerIdPageProps): Promise<JSX.Element|null> => {
    const profile = await currentProfile();

    if (!profile) {
        return redirectToSignIn();
    }

    const server = await db.server.findUnique({
        where: {
            id: params.serverId,
            members: {
                some: {
                    profileId: profile.id,
                }
            }
        },
        include: {
            channels: {
                where: {
                    name: "general"
                },
                orderBy: {
                    createdAt: "asc"
                }
            }
        }
    });

    const initialChannel = server?.channels[0];

    if (initialChannel?.name !== "general") {
        return null;
    }

    return redirect(`/servers/${params.serverId}/channels/${initialChannel?.id}`);
}

export default ServerIdPage;
