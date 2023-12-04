import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: { url: string; }) {
    try {
        const url = new URL(req.url);
        const profileId = url.searchParams.get('profileId');

        if (!profileId) {
            return new NextResponse("Profile ID not provided", { status: 400 });
        }

        const profile = await db.profile.findUnique({
            where: { id: profileId }
        });

        if (profile) {
            return NextResponse.json(profile);
        } else {
            return new NextResponse("Profile not found", { status: 404 });
        }
    } catch (error) {
        console.log("[PROFILES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { profileId: string } }
  ): Promise<NextResponse> {
    try {
      const { displayName, status, about, accessLevel } = await req.json();
  
      const updatedProfile = await db.profile.update({
        where: {
          id: params.profileId,
        },
        data: {
          displayName,
          status, 
          about,
          accessLevel,
        }
      });
  
      return NextResponse.json(updatedProfile);
    } catch (error) {
      console.log("[PROFILE_ID_PATCH]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }
  
