import InitialModal from "@/components/modals/initial-modal";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";

 const SetupPage = async () => {
  const profile = await initialProfile();
  // lets find the profile is the member of server 
  // if there is then immediately load the server for profile
  const server = await db.server.findFirst({
   where:{
    members:{
     some:{
      profileId: profile.id,
     }
    }
   }
  })
  if(server){
   // the immediately redirect to the server for
   return redirect(`/servers/${server.id}`)
  }
  return (  
   <InitialModal/>
  );
 }
  
 export default SetupPage;