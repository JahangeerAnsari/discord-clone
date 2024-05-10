'use client';
import CreateServerModal from "@/components/modals/create-server-modal";
import { useEffect, useState } from "react";
import InvitePeopleModal from "../modals/invite-modal";


const ModalProvider = () => {
 const [isMounted, setIsMounted] = useState(false);

 useEffect(() =>{
 setIsMounted(true)
 },[])

 if(!isMounted){
  return null
 }
 return ( 
  <>
  <CreateServerModal/>
  <InvitePeopleModal/>
  </>
  );
}
 
export default ModalProvider;