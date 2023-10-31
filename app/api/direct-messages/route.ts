/**
 * @module route.ts
 * @description This module provides an API route handler for fetching direct messages within a conversation.
 * @requires @/lib/current-profile
 * @requires next/server
 * @requires @/lib/db
 * @requires @prisma/client
 */

import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { DirectMessage } from "@prisma/client";

/** The batch size for paginated message retrieval. */
const MESSAGES_BATCH = 10;

/**
 * Fetches direct messages from a specified conversation.
 * 
 * This function handles the GET request to retrieve direct messages.
 * It supports optional pagination using a cursor, returning a batch of messages with a provided size.
 * The retrieved messages are ordered by their creation date in descending order.
 * 
 * @param {Request} req - The request object.
 * @returns {Promise<NextResponse>} A promise that resolves to the response of the operation.
 */
export async function GET(req: Request): Promise<NextResponse> {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);

        const cursor = searchParams.get("cursor");
        const conversationId = searchParams.get("conversationId");

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!conversationId) {
            return new NextResponse("Conversation ID missing", { status: 400 });
        }

        let messages: DirectMessage[] = [];

        if (cursor) {
            messages = await db.directMessage.findMany({
                take: MESSAGES_BATCH,
                skip: 1,
                cursor: {
                    id: cursor,
                },
                where: {
                    conversationId,
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
            messages = await db.directMessage.findMany({
                take: MESSAGES_BATCH,
                where: {
                    conversationId,
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
        console.log("[DIRECT_MESSAGES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}