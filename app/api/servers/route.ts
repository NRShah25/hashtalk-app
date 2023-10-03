import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";

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
 * Creates a new server with default channels and members.
 * @param profileId - The ID of the authenticated user's profile.
 * @param name - The name of the server.
 * @param imageUrl - The image URL for the server.
 * @returns The newly created server object.
 */
async function createNewServer(profileId: string, name: string, imageUrl: string) {
    return await db.server.create({
        data: {
            profileId,
            name,
            imageUrl,
            inviteCode: uuidv4(),
            channels: {
                create: [
                    { name: "general", profileId }
                ]
            },
            members: {
                create: [
                    { profileId, role: MemberRole.ADMIN }
                ]
            }
        }
    });
}

/**
 * Handle the POST request to create a new server.
 * @param req - The incoming request object.
 * @returns The newly created server object or an error response.
 */
export async function POST(req: Request) {
    try {
        const { name, imageUrl } = await req.json();
        const profile = await getAuthenticatedProfile();
        
        if (!profile) {
            return unauthorizedResponse();
        }

        const newServer = await createNewServer(profile.id, name, imageUrl);
        return NextResponse.json(newServer);

    } catch (error) {
        console.log("[SERVERS_POST]", error);
        return internalErrorResponse();
    }
}