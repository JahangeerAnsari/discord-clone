import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";
import ServerHeader from "./server-header";

interface ServerSidebarProps{
 serverId: string;
}

const ServerSidebar:React.FC<ServerSidebarProps> = async ({
 serverId
}) => {
 const profile = await currentProfile()
 if(!profile){
  return redirect("/");
 }
 // based on the server find the members and channel associated with it

 const server = await db.server.findUnique({
  where:{
   id:serverId
  }, include:{
   channels:{
    orderBy:{
     createdAt:'asc'
    }
   },
   members:{
    include:{
     profile:true,
    },
    orderBy:{
     role:'asc'
    }
   }
  }
 })
 // let filter the channel type from the server
 const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT);
 const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO);
 const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO);
 // we are not showing our self in the memberlist we show other members to list
 const members = server?.members.filter((member) => member.profileId !== profile.id );
 if(!server){
  return redirect('/')
 }
 // let find out the role of the profile
 const role = server.members.find((member) => member.profileId === profile.id)?.role
 return (
  // server sidebars are
  <div className="flex flex-col h-full text-primary
  w-full dark:bg-[#2B2D31] bg-[#F2F3F5]
  ">
   <ServerHeader
   server={server}
   role={role}
   />

  </div>
   );
}
 
export default ServerSidebar;