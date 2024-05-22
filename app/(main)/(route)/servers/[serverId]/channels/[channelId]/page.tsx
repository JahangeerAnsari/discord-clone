import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface channelIdProps {
  params: {
    serverId: string;
    channelId: string;
  };
}
const ChannelIdPage = async ({ params }: channelIdProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }
  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });
  // one profile having multiple members
  // we want the person which having same profile id
  const member = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
  });
  // want to access channel or member does not exist
  if (!channel || !member) {
    redirect("/");
  }
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full relative">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />
      <div className="flex-1 overflow-y-auto pb-16">
        {" "}
        {/* Add padding-bottom to avoid content overlapping */}
        Future Messages
      </div>
      <div className="fixed bottom-0 w-[80%]">
        <ChatInput
          name={channel.name}
          type="channel"
          apiUrl="/api/socket/messages"
          query={{
            channelId: channel.id,
            serverId: channel.serverId,
          }}
        />
      </div>
    </div>
  );
};

export default ChannelIdPage;
