"use client"

import { useState } from "react";
import { Profile } from "@prisma/client";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { UserAvatar } from "../user-avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { z } from "zod";

export const ProfileModal = () => {
  const router = useRouter();
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const [loadingId, setLoadingId] = useState("");

  const isModalOpen = isOpen && type === "profile";
  const { profile, isAuthenticated } = data as { profile: Profile; isAuthenticated?: boolean };

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
                    <p>{profile?.about}</p>
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