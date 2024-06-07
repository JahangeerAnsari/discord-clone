"use client";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { useModal } from "@/app/hooks/use-modal-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Copy, RefreshCcw } from "lucide-react";
import { getOriginValue } from "@/app/hooks/use-origin";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const InvitePeopleModal = () => {
  const origin = getOriginValue();
  const { isOpen,onOpen, onClose, type, data } = useModal();
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { server } = data;
  const isModalOpen = isOpen && type === "invite";
  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;
  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  const generateNewLink = async () => {

    try {
      setIsLoading(true);
      const response = await axios.patch(`/api/servers/${server?.id}/invite-code`
      );

      onOpen("invite",{server:response.data})
      toast.success("New invite link generated! Please Copy the link")
    } catch (error:any) {
      console.log("error11111111111111111",error);
  
    }finally{
    setIsLoading(false)
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label
            className="uppercase  text-xs font-bold
      text-zinc-500 dark:text-secondary/70"
          >
            Server invite link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
            disabled={isLoading}
              className="bg-zinc-300/50 border-0
       focus-visible:ring-0 text-black
       focus-visible:ring-offset-0
       "
              value={inviteUrl}
            />
            <Button
            disabled={isLoading}
            onClick={onCopy} size="icon">
              {copied ? (
                <Check className="text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          <Button
          onClick={generateNewLink}
          disabled={isLoading}
            variant="link"
            size="sm"
            className="text-xs text-zinc-500 mt-4"
          >
            Generate a new link
            <RefreshCcw className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvitePeopleModal;
