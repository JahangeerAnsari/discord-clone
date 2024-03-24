"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import qs from 'query-string'
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useModal } from "@/hooks/use-modal-store";
import { type } from "os";
import { ChannelType } from "@prisma/client";
import { useEffect } from "react";
// form schema
const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Channel name is required!",
    })
    .refine((name) => name !== "general", {
      message: "Channel name cannot be 'genral'",
    }),
  //only single name will be general

  // (type ChannelType @default(TEXT))
  type: z.nativeEnum(ChannelType),
});

export const CreateChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const params = useParams();
  console.log("params",params);
  const {channelType} = data
  
  const isModalOpen = isOpen && type === "createChannel";
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: channelType || ChannelType.TEXT,
    },
  });

  // set channel type default if it is audion then audio or video
  // then video
  useEffect(() =>{
    if(channelType){
      form.setValue("type", channelType);
    }else{
      form.setValue("type",   ChannelType.TEXT);
    }
  },[channelType, form])
  // extract loading state from form
  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // first we need a query to hold the server indigo
      const url = qs.stringifyUrl({
         url:"/api/channels",
         query:{
          serverId:params.serverId
         }
      })
      await axios.post(url, values);
      form.reset();
      router.refresh();

      onClose();
    } catch (error) {
      console.log("error on server", error);
    }
  };
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
          {/* going to use handleForm  from {...form} 
         and we have also pass by the values onSubmit
         */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="uppercase text-xs font-bold
                     text-zinc-500 dark:text-secondary/70"
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
                        placeholder="Enter channel name"
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
                    <FormLabel>Channel Type</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          className="bg-zinc-300/50
                        border-0 focus:ring-0 text-black ring-offset-0
                        focus:ring-offset-0 capitalize outline-none
                        "
                        >
                          <SelectValue 
                          placeholder="Select a channel type" />
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
                    <FormMessage />
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
