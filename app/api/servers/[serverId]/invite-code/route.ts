import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import {v4 as uuidv4} from "uuid";

export async function PATCH(req:Request, 
 {params}:{params:{serverId:string}}){

 const {serverId} = params;
 console.log("serverId###############3",serverId);

try {
const profile = await currentProfile();
if(!profile){
 return new NextResponse("Unauthorized",{status: 401})
}
if(!serverId){
 return new NextResponse("Server ID missing", {status:400})
}
//here only admin has ability to invite link facilities
const server = await db.server.update({
 where:{
id:serverId,
profileId:profile.id
 },
 data:{
  inviteCode:uuidv4()
 }
})
return NextResponse.json(server)
} catch (error) {
 console.log("EEEEEEEEEEEEEEEEEEEE",error);
 
console.log("[SERVER_ID]", error);
return new NextResponse("Internal Server Error ddddddddddddddddddddddddddddd",{status:500})
}

}