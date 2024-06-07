// it will show the if there is authenticated profile is there

import { auth } from "@clerk/nextjs"
import {db} from '@/lib/db'

// now we can get ever-where is current user and
export  const currentProfile = async () =>{
  const {userId} =  auth();
        
  if(!userId){
   return null;
  }
  const profile = await db.profile.findUnique({
   where:{
    userId: userId
   }
  })
  return profile;

}