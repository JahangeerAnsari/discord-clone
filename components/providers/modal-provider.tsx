'use client';
import CreateServerModal from "@/components/modals/create-server-modal";
import { useEffect, useState } from "react";
import InvitePeopleModal from "../modals/invite-modal";
import EditServerModal from "../modals/edit-server-modal";
import MembersModal from "../modals/members-modal";
import CreateChannelModal from "../modals/create-channel-modal";
import LeaveServerModal from "../modals/leave-server-modal";
import DeleteServerModal from "../modals/delete-server";
import DeleteChannelModal from "../modals/delete-channel-modal";
import EditChannelModal from "../modals/edit-channel-modal";
import MessageFileModal from "../modals/message-file-modal";
import DeleteMessageModal from "../modals/delete-message-modal";


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
  <DeleteMessageModal/>
  <MessageFileModal/>
  <EditChannelModal/>
  <DeleteChannelModal/>
  <DeleteServerModal/>
  <LeaveServerModal/>
  <CreateChannelModal/>
  <CreateServerModal/>
  <InvitePeopleModal/>
  <EditServerModal/>
  <MembersModal/>
  </>
  );
}
 
export default ModalProvider;