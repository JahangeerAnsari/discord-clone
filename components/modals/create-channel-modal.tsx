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
import qs from 'query-string'
import { zodResolver } from "@hookform/resolvers/zod";
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
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useModal } from "@/app/hooks/use-modal-store";
import { ChannelType } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useEffect } from "react";
const CreateChannelModal = () => {
  const router = useRouter();
  const params = useParams();
  const { isOpen, onClose, type ,data} = useModal();
  const {channelType} = data;
  const isModalOpen = isOpen && type === "createChannel";
  const formSchema = z.object({
    name: z
      .string()
      .min(1, {
        message: "Channel name is required",
      })
      .refine((name) => name !== "general", {
        message: "Channel name cannot be 'general'",
      }),
    type: z.nativeEnum(ChannelType),
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type:channelType || ChannelType.TEXT,
    },
  });
  // open model based on type
  useEffect(() =>{
    if(channelType){
   form.setValue("type", channelType)
    }else{
      form.setValue("type", ChannelType.TEXT)
    }
  },[form,channelType])
  // disbaled while submitting the form
  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
       const url = qs.stringifyUrl({
        url:"/api/channels",
        query:{
          serverId:params?.serverId
        }
       })
       await axios.post(url, values);
       toast.success("New Channel Created!")
       form.reset();
       router.refresh();
       onClose()
    } catch (error:any) {
      console.log("Error on creating channel", error);
      toast.error(error)
    }
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
            Create Channel
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="uppercase text-xs font-bold text-zinc-500 
                    dark:text-secondary/70"
                    >
                      Channel Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0
                    focus-visible:ring-0 text-black
                    focus-visible:ring-offset-0
                    "
                        placeholder="Enter Channel Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Channel Type:</FormLabel>
                      <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                          className="bg-zinc-300/50
                          border-0 focus:ring-0
                          text-black ring-offset-0
                          focus:ring-offset-0 capitalize
                          outline-none"
                          >
                            <SelectValue placeholder="Select a channel type"/>

                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(ChannelType).map((type) => (
                            <SelectItem
                            key={type}
                            value={type}
                            className="capitalize"
                            > 
                              {type.toLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage/>
                   
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant="primary" disabled={isLoading}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannelModal;
