"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

interface ServerImageProps {
  id: string;
  imageUrl: string;
  name: string;
};

export const ServerImage = ({
  id,
  imageUrl,
  name
}: ServerImageProps) => {
    const params = useParams();
    const router = useRouter();

    return (
        <div className="relative flex items-center">
            <div className=
                     "relative flex mx-3 h-[64px] w-[64px] rounded-3xl overflow-hidden bg-primary/10 text-primary transition"
            >
                <Image
                    fill
                    src={imageUrl}
                    alt={name}
                />
            </div>
        </div>
    );
}
