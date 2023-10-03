import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

const unauthorizedResponse = (message = "Unauthorized") => new NextResponse(message, { status: 401 });
const badRequestResponse = (message: string) => new NextResponse(message, { status: 400 });
const internalErrorResponse = (message = "Internal Error") => new NextResponse(message, { status: 500 });

/**
 * Extract the serverId from the request URL.
 * @param req - The incoming request object.
 * @returns The serverId from the URL or null.
 */
const getServerIdFromRequest = (req: Request): string | null => {
  const { searchParams } = new URL(req.url);
  return searchParams.get("serverId");
}

/**
 * Validate the request, ensuring a valid profile, serverId, and memberId are present.
 * @param req - The incoming request object.
 * @param params - The parameters object containing memberId.
 * @returns An object containing potential errors and extracted profile and serverId.
 */
const validateRequest = async (req: Request, params: { memberId: string }) => {
  const profile = await currentProfile();
  const serverId = getServerIdFromRequest(req);

  if (!profile) {
    return { error: unauthorizedResponse() };
  }
  if (!serverId) {
    return { error: badRequestResponse("Server ID missing") };
  }
  if (!params.memberId) {
    return { error: badRequestResponse("Member ID missing") };
  }

  return { profile, serverId };
}

/**
 * Handler to delete a member from a server.
 * @param req - The incoming request object.
 * @param params - The parameters object containing memberId.
 * @returns The updated server object or an error response.
 */
export async function DELETE(req: Request, { params }: { params: { memberId: string } }) {
  try {
    const { error, profile, serverId } = await validateRequest(req, params);
    if (error) return error;

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          deleteMany: {
            id: params.memberId,
            profileId: { not: profile.id }
          }
        }
      },
      include: {
        members: {
          include: { profile: true },
          orderBy: { role: "asc" }
        }
      }
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[MEMBER_ID_DELETE]", error);
    return internalErrorResponse();
  }
}

/**
 * Handler to update a member's role in a server.
 * @param req - The incoming request object.
 * @param params - The parameters object containing memberId.
 * @returns The updated server object or an error response.
 */
export async function PATCH(req: Request, { params }: { params: { memberId: string } }) {
  try {
    const { error, profile, serverId } = await validateRequest(req, params);
    if (error) return error;

    const { role } = await req.json();

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
              profileId: { not: profile.id }
            },
            data: { role }
          }
        }
      },
      include: {
        members: {
          include: { profile: true },
          orderBy: { role: "asc" }
        }
      }
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[MEMBERS_ID_PATCH]", error);
    return internalErrorResponse();
  }
}