/**
 * @module route.ts
 * @description This module provides an API route handler for fetching messages from a specific channel.
 * @requires @/lib/current-profile
 * @requires next/server
 * @requires @/lib/db
 * @requires @prisma/client
 */

import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import { Message } from "@prisma/client";
import { db } from "@/lib/db";

/** The batch size for paginated message retrieval. */
const MESSAGES_BATCH = 12;

/**
 * Fetches messages from a specified channel.
 * 
 * This function handles the GET request to retrieve messages from a channel.
 * It supports optional pagination using a cursor, returning a batch of messages with a provided size.
 * The retrieved messages are ordered by their creation date in descending order and include member profile details.
 * 
 * @param {Request} req - The request object.
 * @returns {Promise<NextResponse>} A promise that resolves to the response of the operation.
 */
export async function GET(req: Request): Promise<NextResponse> {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);

        const cursor = searchParams.get("cursor");
        const channelId = searchParams.get("channelId");

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!channelId) {
            return new NextResponse("Channel ID missing", { status: 400 });
        }

        let messages: Message[] = [];

        if (cursor) {
            messages = await db.message.findMany({
                take: MESSAGES_BATCH,
                skip: 1,
                cursor: {
                    id: cursor,
                },
                where: {
                    channelId,
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc",
                }
            })
        } else {
            messages = await db.message.findMany({
                take: MESSAGES_BATCH,
                where: {
                    channelId,
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc",
                }
            });
        }

        let nextCursor = null;

        if (messages.length === MESSAGES_BATCH) {
            nextCursor = messages[MESSAGES_BATCH - 1].id;
        }

        return NextResponse.json({
            items: messages,
            nextCursor
        });

    } catch (error) {
        console.log("[MESSAGES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}