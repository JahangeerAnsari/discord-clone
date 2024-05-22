import { Channel, ChannelType, Server } from "@prisma/client";
import { create } from "zustand";

export type ModalType = "createServer" | 
"invite" | "editServer" | "members" | "createChannel"
| "leaveServer" |"deleteServer" |"deleteChannel" | "editChannel"
| "messageFile"
;
interface PassingServerDataToModal {
  server?: Server;
  // deleteChannel for channels 
  channel?: Channel;
  channelType?:ChannelType;
  // to upload message 
  apiUrl?: string;
  query?:Record<string, any>;
}
interface ModalStore {
  type: ModalType |null ;
  data: PassingServerDataToModal;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: PassingServerDataToModal) => void;
  onClose: () => void;
}
export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
