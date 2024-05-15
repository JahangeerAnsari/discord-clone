import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import ServerHeader from "./server-header";
import { ScrollArea } from "../ui/scroll-area";
import ServerSearch from "./server-search";
import {
  Hash,
  Mic,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Video,
} from "lucide-react";
import { Separator } from "../ui/separator";
import ServerSection from "./server-section";
import ServerChannel from "./server-channel";
import ServerMember from "./server-member";

interface ServerSidebarProps {
  serverId: string;
}

const channelIconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};
const roleIconMap = {
  [MemberRole.GUEST] : null ,
  [MemberRole.MODERATOR]: <ShieldCheck className="text-indigo-500 h-4 w-4" />,
  [MemberRole.ADMIN]: <ShieldAlert className="text-rose-500 h-4 w-4" />,
};

const ServerSidebar: React.FC<ServerSidebarProps> = async ({ serverId }) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/");
  }
  // based on the server find the members and channel associated with it

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });
  // let filter the channel type from the server
  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const audioChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );
  // we are not showing our self in the memberlist we show other members to list
  const members = server?.members.filter(
    (member) => member.profileId !== profile.id
  );
  if (!server) {
    return redirect("/");
  }
  // let find out the role of the profile
  const role = server.members.find(
    (member) => member.profileId === profile.id
  )?.role;
  return (
    // server sidebars are
    <div
      className="flex flex-col h-full text-primary
  w-full dark:bg-[#2B2D31] bg-[#F2F3F5]
  "
    >
      <ServerHeader server={server} role={role} />
      {/* creating a search box  */}
      <ScrollArea className="flex px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIconMap[channel.type],
                })),
              },
              {
                label: "Voice Channels",
                type: "channel",
                data: audioChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIconMap[channel.type],
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIconMap[channel.type],
                })),
              },
              {
                label: "Members",
                type: "member",
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700
        rounded-md my-2"/>
        {!! textChannels?.length && (
        <div className="mb-2">
        <ServerSection
        sectionType="channels"
        channelType={ChannelType.TEXT}
        role={role }
        label="Text Channels"
        />
         <div className="space-y-2">
         {textChannels.map((channel) => (
          <ServerChannel 
          key={channel.id}
          channel={channel}
          role={role}
          server={server}
          />
        ))}
         </div>
        </div>

        )}
        {/* for Audio Channel */}
        {!! audioChannels?.length && (
        <div className="mb-2">
        <ServerSection
        sectionType="channels"
        channelType={ChannelType.AUDIO}
        role={role }
        label=" Voice Channels"
        />
        <div className="space-y-2">
        {audioChannels.map((channel) => (
          <ServerChannel 
          key={channel.id}
          channel={channel}
          role={role}
          server={server}
          />
        ))}
        </div>
        
        </div>

        )}
        {/* FOR VIDEO CHANNEL */}
        {!! videoChannels?.length && (
        <div className="mb-2">
        <ServerSection
        sectionType="channels"
        channelType={ChannelType.VIDEO}
        role={role }
        label="Video Channels"
        />
        <div className="space-y-2">
        {videoChannels.map((channel) => (
          <ServerChannel 
          key={channel.id}
          channel={channel}
          role={role}
          server={server}
          />
        ))}
        </div>
        </div>

        )}
        {/* for members */}
        {!! members?.length && (
        <div className="mb-2">
        <ServerSection
        sectionType="members"
        role={role }
        label="Members"
        server={server}
        />
       <div className="space-y-2">
       {members.map((member) => (
          <ServerMember
          key={member.id}
          member={member}
          server={server}
          />
        ))}
       </div>
        </div>

        )}
        
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;
