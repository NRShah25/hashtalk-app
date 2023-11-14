import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ServerAvatarProps {
  src?: string;
  className?: string;
};

export const ServerAvatar = ({
  src,
  className
}: ServerAvatarProps) => {
  return (
    <Avatar className={cn(
      "h-7 w-7 md:h-10 md:w-10",
      className
    )}>
      <AvatarImage src={src} />
    </Avatar>
  )
}