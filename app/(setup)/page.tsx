import { InitialModal } from "@/components/modals/initial-modal";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";

const SetupPage = async () => {
  const profile = await initialProfile();
/*
we gonna find out profileId one of the members 
in the server
lets assume this profile is the member of the server
and load it immediately for user for channel(general)

*/
  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if(server){
   return redirect(`/server/${server.id}`);
  }
  
  return <InitialModal/>;
};

export default SetupPage;
