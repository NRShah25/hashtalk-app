/**
 * @module route.ts
 * @description This module provides an API route handler for updating the invite code of a specified server.
 * @requires uuid
 * @requires next/server
 * @requires @/lib/current-profile
 * @requires @/lib/db
 */

import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

/**
 * Updates the invite code for a specified server by its serverId.
 * 
 * This function handles the PATCH request to generate and assign a new unique invite code to the server.
 * The logged-in user must be the owner of the server to execute this action.
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
            return new NextResponse("Server ID Missing", { status: 400 });
        }

        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id,
            },
            data: {
                inviteCode: uuidv4(),
            },
        });

        return NextResponse.json(server);

    } catch (error) {
        console.log("[SERVER_ID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}