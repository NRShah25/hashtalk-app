import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
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

        const existingMember = await db.server.findFirst({
            where: {
                id: params.serverId,
                members: {
                    some: {
                        profileId: profile.id
                    }
                }
            }
        });

        if (existingMember) {
            return new NextResponse("Already a member", { status: 409 });
        }

        const server = await db.server.update({
            where: {
                id: params.serverId
            },
            data: {
                members: {
                    create: {
                        profileId: profile.id
                    }
                }
            }
        });

        return NextResponse.json(server);

    } catch (error) {
        console.log("[SERVER_ID_JOIN]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
