import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { MemberRole } from "@prisma/client";
export async function POST(request: Request, response: Response) {
  try {
    const { name, imageUrl } = await request.json();

    const profile = await currentProfile();
    if (!profile) {
      return NextResponse.json("Unauthorized User", { status: 404 });
    }
    const server = await db.server.create({
      data: {
        profileId: profile.id,
        name,
        imageUrl,
        inviteCode: uuidv4(),
        channels: {
          create: [{ name: "general", profileId: profile.id }],
        },
        members: {
          create: [
            {
              profileId: profile.id,
              role: MemberRole.ADMIN,
            },
          ],
        },
      },
    });
    return NextResponse.json(server)
  } catch (error) {
    console.log("[SERVERS_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
