"use client"

import { useEffect, useState } from "react";
import { Profile } from "@prisma/client";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { UserAvatar } from "../user-avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { RadioGroupItem } from "../ui/radio-group";
import { Input } from "../ui/input";

const ProfileAccessLevel = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
};

const formSchema = z.object({
  accessLevel: z.enum([ProfileAccessLevel.PUBLIC, ProfileAccessLevel.PRIVATE]).refine(val => val === ProfileAccessLevel.PUBLIC || val === ProfileAccessLevel.PRIVATE, {
    message: "Access level is required."
  }),
  displayName: z.string().min(1, {
    message: "Display name is required."
  }),
  status: z.string().min(1, {
    message: "Status is required."
  }),
  about: z.string().min(1, {
    message: "About is required."
  }),
});

export const ProfileModal = () => {
  const router = useRouter();
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const [loadingId, setLoadingId] = useState("");

  const isModalOpen = isOpen && type === "profile";
  const { profile, isAuthenticated } = data as { profile: Profile; isAuthenticated?: boolean };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accessLevel: ProfileAccessLevel.PUBLIC,
      displayName: '',
      status: '',
      about: ''
    }
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        accessLevel: profile.accessLevel || ProfileAccessLevel.PUBLIC,
        displayName: profile.displayName || '',
        status: profile.status || '',
        about: profile.about || ''
      });
    }
  }, [profile, form.reset]);
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/profiles/${profile?.id}`, values);

      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            <div className="flex items-center justify-center space-x-2">
              <UserAvatar src={profile?.imageUrl}/>
            </div>
          </DialogTitle>
          <DialogDescription className="text-2xl text-center font-bold">
            {profile?.displayName}
            {profile?.displayName !== profile?.username && ` (${profile?.username})`}
          </DialogDescription>
        </DialogHeader>
          {isAuthenticated && <div>
            <Tabs defaultValue="view">
              <TabsList className="flex justify-center">
                <TabsTrigger value="view">View</TabsTrigger>
                <TabsTrigger value="edit">Edit</TabsTrigger>
              </TabsList>
              <TabsContent value="view">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Status
                    </CardTitle>
                    <CardDescription>
                      Last updated {profile?.updatedAt ? profile.updatedAt.toLocaleString() : 'never'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{profile?.status}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      About
                    </CardTitle>
                    <CardDescription>
                      User since {profile?.createdAt ? profile.createdAt.toLocaleDateString() : 'forever'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{profile?.about}</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="edit">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Edit Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                  <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                    >
                      Display Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        autoComplete = "off"
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter your display name."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                    >
                      Status
                    </FormLabel>
                    <FormControl>
                      <Input
                        autoComplete = "off"
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="How are you feeling today?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="about"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                    >
                      About
                    </FormLabel>
                    <FormControl>
                      <Input
                        autoComplete = "off"
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Give us your life story."
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
              <Button>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>}
          {!isAuthenticated && <div>
            <Card>
                  <CardHeader>
                    <CardTitle>
                      Status
                    </CardTitle>
                    <CardDescription>
                      Last updated {profile?.updatedAt ? profile.updatedAt.toLocaleString() : 'never'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{profile?.status}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      About
                    </CardTitle>
                    <CardDescription>
                      Last updated {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{profile?.about}</p>
                  </CardContent>
                </Card>
          </div>}
      </DialogContent>
    </Dialog>
  )
}