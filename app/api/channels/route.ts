/**
 * @module route.ts
 * @description This module provides an API route handler for creating channels within a server.
 * @requires @/lib/current-profile
 * @requires @prisma/client
 * @requires next/server
 * @requires @/lib/db
 */

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

/**
 * Creates a new channel within a specified server.
 * 
 * This function handles the POST request to create a channel.
 * It first checks if the current user's profile is valid and if the required parameters are provided.
 * The user must be either an ADMIN or MODERATOR of the server to create a channel.
 * 
 * @param {Request} req - The request object.
 * @returns {Promise<NextResponse>} A promise that resolves to the response of the operation.
 */
export async function POST(req: Request): Promise<NextResponse> {
    try {
        const profile = await currentProfile();
        const { name, type } = await req.json();
        const { searchParams } = new URL(req.url);

        const serverId = searchParams.get("serverId");

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!serverId) {
            return new NextResponse("Server ID missing", { status: 400 });
        }

        if (name === "general") {
            return new NextResponse("Name cannot be 'general'", { status: 400 });
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data: {
                channels: {
                    create: {
                        profileId: profile.id,
                        name,
                        type,
                    }
                }
            }
        });

        return NextResponse.json(server);

    } catch (error) {
        console.log("CHANNELS_POST", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}