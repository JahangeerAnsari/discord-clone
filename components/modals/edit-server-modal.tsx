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
import axios from "axios";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {ServerWithMembersWithProfile} from '@/types'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FileUpload from "@/components/file-upload";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useModal } from "@/app/hooks/use-modal-store";
import { useEffect } from "react";
const EditServerModal = () => {
  const router = useRouter();
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "editServer";
  const { server } = data as {server:ServerWithMembersWithProfile};
  const formSchema = z.object({
    name: z.string().min(1, {
      message: "Server name is required",
    }),
    imageUrl: z.string().min(1, {
      message: "Server image is required",
    }),
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });
  // whenever component load it will reload the form data to the modal
  useEffect(() => {
    form.setValue("name", server?.name);
    form.setValue("imageUrl", server?.imageUrl);
  }, [form, server]);
  // disbaled while submitting the form
  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await axios
      .patch(`/api/servers/${server?.id}`, values)
      .then(() => {
        toast.success("Server Updated!");
        form.reset();
        router.refresh();
        onClose();
      })
      .catch((error) => {
        toast.error(error);
      });
  };
  // close the modal
  const handleCloseModal = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Customize your server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your server a personality with a name and an image. You can
            always Change it later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="serverImage"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="uppercase text-xs font-bold text-zinc-500 
                    dark:text-secondary/70"
                    >
                      Server Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0
                    focus-visible:ring-0 text-black
                    focus-visible:ring-offset-0
                    "
                        placeholder="Enter Server Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant="primary" disabled={isLoading}>
                Update
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditServerModal;
