"use client";

import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogFooter,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";

export const InitialModal = () => {
  const form = useForm({
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });
  return (
    <Dialog open>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Customize your server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your server a personality with a name and an image. You can
            always change it later.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
