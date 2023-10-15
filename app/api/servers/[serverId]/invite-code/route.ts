import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

const unauthorizedResponse = (message = "Unauthorized") => new NextResponse(message, { status: 401 });
const badRequestResponse = (message: string) => new NextResponse(message, { status: 400 });
const internalErrorResponse = (message = "Internal Error") => new NextResponse(message, { status: 500 });

/**
 * Validates the user's profile.
 * @returns The user's profile or null if unauthorized.
 */
async function getAuthenticatedProfile() {
    const profile = await currentProfile();
    return profile || null;
}

/**
 * Updates the server's invite code.
 * @param profileId - The ID of the authenticated user's profile.
 * @param serverId - The ID of the server to update.
 * @returns The updated server object.
 */
async function updateServerInviteCode(profileId: string, serverId: string) {
    return await db.server.update({
        where: {
            id: serverId,
            profileId: profileId,
        },
        data: {
            inviteCode: uuidv4(),
        },
    });
}

/**
 * Handle the PATCH request to update the server's invite code.
 * @param req - The incoming request object.
 * @param params - The parameters object containing serverId.
 * @returns The updated server object or an error response.
 */
export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {
    try {
        const profile = await getAuthenticatedProfile();
        
        if (!profile) {
            return unauthorizedResponse();
        }

        if (!params.serverId) {
            return badRequestResponse("Server ID Missing");
        }

        const updatedServer = await updateServerInviteCode(profile.id, params.serverId);
        return NextResponse.json(updatedServer);

    } catch (error) {
        console.log("[SERVER_ID]", error);
        return internalErrorResponse();
    }
}
