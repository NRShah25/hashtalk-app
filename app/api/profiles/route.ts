/**
 * @module route.ts
 * @description This module provides an API route handler for creating new servers.
 * @requires uuid
 * @requires next/server
 * @requires @prisma/client
 * @requires @/lib/current-profile
 * @requires @/lib/db
 */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(): Promise<NextResponse> {
    try {
        const profiles = await db.profile.findMany();
        return NextResponse.json(profiles);
    } catch (error) {
        console.log("[PROFILES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}