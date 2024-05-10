import { Server } from "@prisma/client";
import { create } from "zustand";

export type ModalType ="createServer" | "invite"
interface PassingServerDataToModal{
 server?:Server
}
interface ModalStore{
 type:ModalType |null;
 data:PassingServerDataToModal
 isOpen: boolean;
 onOpen: (type:ModalType, data?:PassingServerDataToModal) => void;
 onClose: () => void;
}
export const useModal = create<ModalStore>((set) =>({
 type:null,
 data:{},
 isOpen:false,
 onOpen: (type, data={}) => set({isOpen:true,
  type,data}),
 onClose:() => set({type:null,isOpen:false})
}))