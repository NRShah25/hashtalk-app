import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

const unauthorizedResponse = (message = "Unauthorized") => new NextResponse(message, { status: 401 });
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
 * Handle the action of a user deleting a server.
 * @param profileId - The ID of the authenticated user's profile.
 * @param serverId - The ID of the server to delete.
 * @returns The deleted server object.
 */
async function deleteServer(profileId: string, serverId: string) {
    return await db.server.delete({
        where: {
            id: serverId,
            profileId: profileId,
        }
    });
}

/**
 * Handle the action of a user updating server details.
 * @param profileId - The ID of the authenticated user's profile.
 * @param serverId - The ID of the server to update.
 * @param data - The updated data for the server.
 * @returns The updated server object.
 */
async function updateServer(profileId: string, serverId: string, data: { name: string, imageUrl: string }) {
    return await db.server.update({
        where: {
            id: serverId,
            profileId: profileId,
        },
        data
    });
}

/**
 * Handle the DELETE request to delete a server.
 * @param req - The incoming request object.
 * @param params - The parameters object containing serverId.
 * @returns The deleted server object or an error response.
 */
export async function DELETE(req: Request, { params }: { params: { serverId: string } }) {
    try {
        const profile = await getAuthenticatedProfile();
        
        if (!profile) {
            return unauthorizedResponse();
        }

        const deletedServer = await deleteServer(profile.id, params.serverId);
        return NextResponse.json(deletedServer);

    } catch (error) {
        console.log("[SERVER_ID_DELETE]", error);
        return internalErrorResponse();
    }
}

/**
 * Handle the PATCH request to update server details.
 * @param req - The incoming request object.
 * @param params - The parameters object containing serverId.
 * @returns The updated server object or an error response.
 */
export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {
    try {
        const profile = await getAuthenticatedProfile();
        const { name, imageUrl } = await req.json();

        if (!profile) {
            return unauthorizedResponse();
        }

        const updatedData = { name, imageUrl };
        const updatedServer = await updateServer(profile.id, params.serverId, updatedData);
        return NextResponse.json(updatedServer);

    } catch (error) {
        console.log("[SERVER_ID_PATCH]", error);
        return internalErrorResponse();
    }
}