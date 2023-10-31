/**
 * @module route.ts
 * @description This module provides API route handlers for specific member operations within a server.
 * @requires next/server
 * @requires @/lib/current-profile
 * @requires @/lib/db
 */

import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";


/**
 * Removes a specified member from a server by their memberId.
 * 
 * This function handles the DELETE request to remove a member.
 * The logged-in user must be a member of the server to execute this action.
 * 
 * @param {Request} req - The request object.
 * @param {Object} params - The parameters passed to the route.
 * @param {string} params.memberId - The ID of the member.
 * @returns {Promise<NextResponse>} A promise that resolves to the response of the operation.
 */
export async function DELETE(
  req: Request,
  { params }: { params: { memberId: string } }
): Promise<NextResponse> {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorized" ,{ status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    if (!params.memberId) {
      return new NextResponse("Member ID missing", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          deleteMany: {
            id: params.memberId,
            profileId: {
              not: profile.id
            }
          }
        }
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          }
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[MEMBER_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

/**
 * Updates the role of a specified member in a server by their memberId.
 * 
 * This function handles the PATCH request to update a member's role.
 * The logged-in user must be a member of the server to execute this action.
 * 
 * @param {Request} req - The request object.
 * @param {Object} params - The parameters passed to the route.
 * @param {string} params.memberId - The ID of the member.
 * @returns {Promise<NextResponse>} A promise that resolves to the response of the operation.
 */
export async function PATCH(
  req: Request,
  { params }: { params: { memberId: string } }
): Promise<NextResponse> {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const { role } = await req.json();

    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    if (!params.memberId) {
      return new NextResponse("Member ID missing", { status: 400 });
    }

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
              profileId: {
                not: profile.id
              }
            },
            data: {
              role
            }
          }
        }
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc"
          }
        }
      }
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[MEMBERS_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}