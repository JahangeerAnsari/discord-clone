import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
}

const InviteCodePage = async ({ params }: InviteCodePageProps) => {
  const profile = await currentProfile();
  console.log("profiel$$$$$$$$$$$paras",profile);
  
  // if not login
  if (!profile) {
    return redirectToSignIn();
  }
  if (!params.inviteCode) {
    return redirect("/");
  }
  // check it is already part of the server or not
  // invite cod already part
  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }

  // otherwise add to the members
  const updateServerWithNewMember = await db.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [{ profileId: profile.id }],
      },
    },
  });
  if (updateServerWithNewMember) {
    return redirect(`/servers/${updateServerWithNewMember.id}`);
  }
  return null;
  
};

export default InviteCodePage;
