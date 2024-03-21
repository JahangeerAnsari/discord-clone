import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!params.serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }
    const server = await db.server.update({
      //delete profile id from server getting
      where: {
        id: params.serverId,
        //admin not delete
        profileId: {
          not: profile.id,
        },
        // person part of member who want leave
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      // deleting member maching profile id
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("error leave server", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
