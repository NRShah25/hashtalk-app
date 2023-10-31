/**
 * @module route.ts
 * @description This module provides API route handlers for specific server operations.
 * @requires next/server
 * @requires @/lib/current-profile
 * @requires @/lib/db
 */

import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

/**
 * Deletes a specified server by its serverId.
 * 
 * This function handles the DELETE request to remove a server.
 * The logged-in user must be the owner of the server to execute this action.
 * 
 * @param {Request} req - The request object.
 * @param {Object} params - The parameters passed to the route.
 * @param {string} params.serverId - The ID of the server.
 * @returns {Promise<NextResponse>} A promise that resolves to the response of the operation.
 */
export async function DELETE(
    req: Request,
    { params }: { params: { serverId: string } }
): Promise<NextResponse> {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server = await db.server.delete({
      where: {
        id: params.serverId,
        profileId: profile.id,
      }
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

/**
 * Updates the details of a specified server by its serverId.
 * 
 * This function handles the PATCH request to update server details.
 * The logged-in user must be the owner of the server to execute this action.
 * 
 * @param {Request} req - The request object.
 * @param {Object} params - The parameters passed to the route.
 * @param {string} params.serverId - The ID of the server.
 * @returns {Promise<NextResponse>} A promise that resolves to the response of the operation.
 */
export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
): Promise<NextResponse> {
  try {
    const profile = await currentProfile();
    const { name, imageUrl } = await req.json();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        name,
        imageUrl,
      }
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}