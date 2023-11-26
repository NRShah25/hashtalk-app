"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { ServerAvatar } from "../server-avatar";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { FileUpload } from "../file-upload";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModal } from "@/hooks/use-modal-store";

type Server = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  inviteCode: string;
  profileId: string;
  createdAt: Date;
  updatedAt: Date;

  _count: { members: number };
};

const ServerAccessLevel = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
};

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Server name is required."
  }),
  description: z.string().min(1, {
    message: "Server description is required."
  }),
  accessLevel: z.enum([ServerAccessLevel.PUBLIC, ServerAccessLevel.PRIVATE]).refine(val => val === ServerAccessLevel.PUBLIC || val === ServerAccessLevel.PRIVATE, {
    message: "Access level is required."
  }),
  imageUrl: z.string().min(1, {
    message: "Server image is required."
  })
});

export const InitialModal = () => {
  const { onClose } = useModal();
  const router = useRouter();
  const [servers, setServers] = useState<Server[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  const fetchServers = async () => {
    try {
      const response = await fetch('/api/servers');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      let serverList: Server[] = await response.json();

      serverList.sort((a, b) => b._count.members - a._count.members);

      setServers(serverList);
    } catch (error) {
      console.error('Error fetching servers:', error);
    }
};

fetchServers();

}, []);

const handleJoinServer = async (serverId: string) => {
  try {
    const response = await axios.post(`/api/servers/${serverId}/join`);
    
    if (response.status === 200) {
      router.push(`/servers/${serverId}`);
    } else {
      console.error('Server join was unsuccessful:', response.data.message);
    }
  } catch (error) {
    console.error('Error joining server:', error);
  }
};

const form = useForm({
  resolver: zodResolver(formSchema),
  defaultValues: {
    name: "",
    description: "",
    accessLevel: ServerAccessLevel.PUBLIC,
    imageUrl: "",
  }
});

const isLoading = form.formState.isSubmitting;

const onSubmit = async (values: z.infer<typeof formSchema>) => {
  try {
    await axios.post("/api/servers", values);

    form.reset();
    router.refresh();
    onClose();
  } catch (error) {
    console.log(error);
  }
}

return (
  <Dialog open>
    <DialogContent className="bg-white text-black overflow-hidden">
      <DialogHeader className="pt-8 px-6">
        <DialogTitle className="text-2xl text-center font-bold">Welcome to #talk!</DialogTitle>
        <DialogDescription className="text-center text-zinc-500">
            Pick a server to join and start the conversation!
        </DialogDescription>
      </DialogHeader>
      <Tabs defaultValue="join">
        <TabsList className="flex justify-center">
          <TabsTrigger value="join">Join</TabsTrigger>
          <TabsTrigger value="create">Create</TabsTrigger>
        </TabsList>
        <TabsContent value="join">
          <ScrollArea className="mt-8 max-h-[420px] pr-6">
            {servers.length > 0 ? (
              servers.map((server) => (
                <div key={server.id} className="flex items-center justify-between gap-x-2 mb-6">
                  <div className="flex items-center gap-x-2">
                    <ServerAvatar src={server.imageUrl} />
                    <div className="flex flex-col gap-y-1">
                      <div className="font-semibold text-s flex items-baseline">
                        <span className="font-bold">{server.name}</span>
                        <span className="mx-2">•</span>
                        <span>{server._count.members} {server._count.members === 1 ? 'member' : 'members'}</span>
                      </div>
                      <span className="text-xs">{server.description}</span>
                    </div>
                  </div>
                  <Button onClick={() => handleJoinServer(server.id)}>Join</Button>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <span>No servers available. Why not try creating one?</span>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
        <TabsContent value="create">
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
                      className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                    >
                      Server name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter server name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                    >
                      Server description
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter server description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="accessLevel"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel 
                      className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                    >
                      Access level
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="PUBLIC" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Public
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="PRIVATE" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Private
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
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
        </TabsContent>
      </Tabs>
    </DialogContent>
  </Dialog>
);
};