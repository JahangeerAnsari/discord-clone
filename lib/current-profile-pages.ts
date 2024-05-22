// auth with  clerk not work for pages/socket/ messages 
// so that we have created new one
import {NextApiRequest} from 'next'
import { getAuth } from "@clerk/nextjs/server"
import {db} from '@/lib/db'

// now we can get ever-where is current user and
export  const currentProfilePages = async (req:NextApiRequest) =>{
  const {userId} =  getAuth(req);
        
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