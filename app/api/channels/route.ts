import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole, ChannelType } from "@prisma/client";
import { NextResponse } from "next/server";

const unauthorizedResponse = () => new NextResponse("Unauthorized", { status: 401 });

const badRequestResponse = (message: string) => new NextResponse(message, { status: 400 });

const internalErrorResponse = () => new NextResponse("Internal Error", { status: 500 });

/**
 * Check if the given type is a valid ChannelType.
 * @param {string} type - The type to check.
 */
function isValidChannelType(type: string): type is ChannelType {
    return Object.values(ChannelType).includes(type as ChannelType);
}

/**
 * The main POST handler for the channel creation endpoint.
 * - Validates the request.
 * - Checks permissions.
 * - Creates a new channel if valid.
 *
 * @param {Request} req - The request object.
 */
export async function POST(req: Request) {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return unauthorizedResponse();
        }

        const { name, type } = await req.json();

        if (!isValidChannelType(type)) {
            return badRequestResponse("Invalid channel type");
        }

        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");

        if (!serverId) {
            return badRequestResponse("Server ID missing");
        }

        if (name === "general") {
            return badRequestResponse("Name cannot be 'general'");
        }

        const updatedServer = await createChannelInServer(profile.id, serverId, name, type);

        return NextResponse.json(updatedServer);

    } catch (error) {
        console.log("CHANNELS_POST", error);
        return internalErrorResponse();
    }
}

/**
 * Creates a channel in a server.
 * 
 * @param {string} profileId - ID of the profile creating the channel.
 * @param {string} serverId - ID of the server in which to create the channel.
 * @param {string} name - Name of the new channel.
 * @param {ChannelType} type - Type of the new channel (e.g. TEXT, AUDIO).
 */
async function createChannelInServer(profileId: string, serverId: string, name: string, type: ChannelType) {
    return db.server.update({
        where: {
            id: serverId,
            members: {
                some: {
                    profileId: profileId,
                    role: {
                        in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                    }
                }
            }
        },
        data: {
            channels: {
                create: {
                    profileId: profileId,
                    name,
                    type,
                }
            }
        }
    });
}
