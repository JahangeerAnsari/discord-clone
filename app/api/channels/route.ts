import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req:Request){
try {
 const profile = await currentProfile();
 const {name,type} = await req.json();
 // get the serverId BY searchParams
 const {searchParams} = new URL(req.url);
 const serverId =searchParams.get('serverId');
 if(!profile){
  return new NextResponse("Unauthorized",{status: 401})
 }
 if(!serverId){
  return new NextResponse("Server Id is missing",{status: 400})
 }

 // general protection check
 // when user visit any channel he redirect to general channel
 if(name === "general"){
  return new NextResponse("Name cannot be 'general'",{status:400})
 }
 // both modarator and admin can create channel
 // member can create a channel and its role be admin and moderator
const server = await db.server.update({
 where:{
  id:serverId,
  members:{
   some:{
    profileId:profile.id,
    role:{
     in: [MemberRole.ADMIN, MemberRole.MODERATOR]
    }
   }
  }
 },
 data:{
  channels:{
   create:{
    profileId:profile.id,
    name,
    type
   }
  }
 }
});
return NextResponse.json(server)

} catch (error) {
 console.log("[CHANNEL_ERROR]",error);
 return new NextResponse("Internal Server Error",{status:500})
 
}
}