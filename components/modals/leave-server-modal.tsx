"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { useModal } from "@/app/hooks/use-modal-store";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

const LeaveServerModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { server } = data;
  const isModalOpen = isOpen && type === "leaveServer";
  const onLeaveServer = async () => {
    try {
      setIsLoading(true);
      await axios.patch(`/api/servers/${server?.id}/leave`);
      onClose();
      router.refresh();
      toast.success("User Remove from Server");
      router.push("/");
    } catch (error: any) {
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Leave Server ?
          </DialogTitle>
          <DialogDescription className="text-center text-zinc ">
            Are you sure you want to leave
            <span className="font-semibold text-indigo-600 mx-1">
              #{server?.name} ?
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              onClick={onLeaveServer}
              variant="primary"
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveServerModal;
