import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

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
 * Handle the action of a user leaving a server.
 * @param profileId - The ID of the authenticated user's profile.
 * @param serverId - The ID of the server to leave.
 * @returns The updated server object after the user leaves.
 */
async function leaveServer(profileId: string, serverId: string) {
    return await db.server.update({
        where: {
            id: serverId,
            profileId: {
                not: profileId
            },
            members: {
                some: {
                    profileId: profileId
                }
            }
        },
        data: {
            members: {
                deleteMany: {
                    profileId: profileId
                }
            }
        }
    });
}

/**
 * Handle the PATCH request to allow a user to leave a server.
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
            return badRequestResponse("Server ID missing");
        }

        const updatedServer = await leaveServer(profile.id, params.serverId);
        return NextResponse.json(updatedServer);

    } catch (error) {
        console.log("[SERVER_ID_LEAVE]", error);
        return internalErrorResponse();
    }
}