/**
 * @module route.ts
 * @description This module provides an API route handler for allowing a user to leave a specified server.
 * @requires @/lib/current-profile
 * @requires @/lib/db
 * @requires next/server
 */

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * Allows a user to leave a specified server by its serverId.
 * 
 * This function handles the PATCH request to remove the current user's profile from the server's member list.
 * The logged-in user must be a member of the server, but not the owner, to execute this action.
 * 
 * @param {Request} req - The request object.
 * @param {Object} params - The parameters passed to the route.
 * @param {string} params.serverId - The ID of the server.
 * @returns {Promise<NextResponse>} A promise that resolves to the response of the operation.
 */
export async function PATCH(
    req: Request,
    { params }: { params: { serverId: string } }
): Promise<NextResponse> {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!params.serverId) {
            return new NextResponse("Server ID missing", { status: 400 });
        }

        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: {
                    not: profile.id
                },
                members: {
                    some: {
                        profileId: profile.id
                    }
                }
            },
            data: {
                members: {
                    deleteMany: {
                        profileId: profile.id
                    }
                }
            }
        });

        return NextResponse.json(server);

    } catch (error) {
        console.log("[SERVER_ID_LEAVE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
