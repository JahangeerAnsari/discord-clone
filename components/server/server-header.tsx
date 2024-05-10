"use client";

import { ServerWithMembersWithProfile } from "@/types";
import { MemberRole } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from "lucide-react";
import { useModal } from "@/app/hooks/use-modal-store";

interface ServerHeaderProps {
  server: ServerWithMembersWithProfile;
  role?: MemberRole;
}
const ServerHeader: React.FC<ServerHeaderProps> = ({ server, role }) => {
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;
  const {onOpen} = useModal()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button
          className="w-full text-md font-semibold
 px-3 flex items-center h-12 border-neutral-200
 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10
 dark:hover:bg-zinc-700/50 transition
 "
        >
          {server?.name}
          <ChevronDown className="h5 w-5 ml-auto" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="
      w-56 text-xs font-medium text-black
      dark:text-neutral-400 space-y-[2px]"
      >
        {/* only admin or moderators  can invite peoplw*/}
        {isModerator && (
          <DropdownMenuItem
          onClick={() =>onOpen("invite",{server})}
            className="
              text-indigo-600 dark:text-indigo-400
              px-3 py-2 text-sm cursor-pointer
              "
          >
            Invite People
            <UserPlus className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
          className="px-3 py-2 text-sm cursor-pointer
              ">
            Server Settings
            <Settings className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
          className="px-3 py-2 text-sm cursor-pointer
              ">
            Manage Members
            <Users className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem
          className="px-3 py-2 text-sm cursor-pointer
              ">
            Create Channel
            <PlusCircle className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {
         isModerator && (<DropdownMenuSeparator/>)
        }
        {isAdmin && (
          <DropdownMenuItem
          className="
          text-rose-500
          px-3 py-2 text-sm cursor-pointer
              ">
            Delete Channel
            <Trash
             className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem
          className="
          text-rose-500
          px-3 py-2 text-sm cursor-pointer
              ">
               Leave Channel
            <LogOut
             className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServerHeader;
