/**
 * @module route.ts
 * @description This module provides API route handlers for specific channel operations.
 * @requires @/lib/current-profile
 * @requires next/server
 * @requires @/lib/db
 * @requires @prisma/client
 */

import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import {db } from "@/lib/db";
import { MemberRole } from "@prisma/client";

/**
 * Deletes a specified channel by its channelId.
 * 
 * This function doesn't allow deletion of a channel named "general".
 * The user must be either an Admin or Moderator to delete a channel.
 * 
 * @param {Request} req - The request object.
 * @param {Object} params - The parameters passed to the route.
 * @param {string} params.channelId - The ID of the channel.
 * @returns {Promise<NextResponse>} A promise that resolves to the response of the operation.
 */
export async function DELETE(
    req: Request,
    { params }: { params: {channelId: string } }
) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);

        const serverId = searchParams.get("serverId");
        
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!serverId) {
            return new NextResponse("Server ID missing", { status: 400});
        }

        if (!params.channelId) {
            return new NextResponse("Channel ID missing", { status: 400 });
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR],
                        }
                    }
                }
            },
            data: {
                channels: {
                    delete: {
                        id: params.channelId,
                        name: {
                            not: "general",
                        }
                    }
                }
            }
        });

        return NextResponse.json(server);

    } catch (error) {
        console.log("[CHANNEL_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}


/**
 * Updates the details of a specified channel by its channelId.
 * 
 * This function doesn't allow updates to a channel named "general".
 * The user must be either an ADMIN or MODERATOR to update a channel.
 * 
 * @param {Request} req - The request object.
 * @param {Object} params - The parameters passed to the route.
 * @param {string} params.channelId - The ID of the channel.
 * @returns {Promise<NextResponse>} A promise that resolves to the response of the operation.
 */
export async function PATCH(
    req: Request,
    { params }: { params: {channelId: string } }
) {
    try {
        const profile = await currentProfile();
        const { name, type } = await req.json();
        const { searchParams } = new URL(req.url);

        const serverId = searchParams.get("serverId");
        
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!serverId) {
            return new NextResponse("Server ID missing", { status: 400});
        }

        if (!params.channelId) {
            return new NextResponse("Channel ID missing", { status: 400 });
        }

        if (name === "general") {
            return new NextResponse("Name cannot be 'general'", {
                status: 400
            });
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR],
                        }
                    }
                }
            },
            data: {
                channels: {
                    update: {
                        where: {
                            id: params.channelId,
                            NOT: {
                                name: "general",
                            },
                        },
                        data: {
                            name,
                            type,
                        }
                    }
                }
            }
        });

        return NextResponse.json(server);

    } catch (error) {
        console.log("[CHANNEL_ID_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}