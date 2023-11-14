/**
 * @module route.ts
 * @description This module provides an API route handler for creating new servers.
 * @requires uuid
 * @requires next/server
 * @requires @prisma/client
 * @requires @/lib/current-profile
 * @requires @/lib/db
 */

import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function GET(): Promise<NextResponse> {
    try {
        const servers = await db.server.findMany({
            include: {
                _count: {
                    select: { members: true }
                }
            }
        });
        return NextResponse.json(servers);
    } catch (error) {
        console.log("[SERVERS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}


/**
 * Creates a new server with the provided details.
 * 
 * This function handles the POST request to create a new server.
 * It generates a unique invite code for the server, creates a default "home" channel,
 * and adds the logged-in user to the server as an admin.
 * 
 * @param {Request} req - The request object containing server details.
 * @returns {Promise<NextResponse>} A promise that resolves to the response of the operation.
 */
export async function POST(req: Request): Promise<NextResponse> {
    try {
        const { name, description, imageUrl } = await req.json();
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const server = await db.server.create({
            data: {
                profileId: profile.id,
                name,
                description,
                imageUrl,
                inviteCode: uuidv4(),
                channels: {
                    create: [
                        { name: "home", profileId: profile.id }
                    ]
                },
                members: {
                    create: [
                        { profileId: profile.id, role: MemberRole.ADMIN }
                    ]
                }
            }
        });

        return NextResponse.json(server);

    } catch (error) {
        console.log("[SERVERS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}