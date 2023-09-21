import { UserButton } from "@clerk/nextjs";
import SideBar from "./SideBar";
export default function Home() {
  return (
    <div>
      <UserButton
        afterSignOutUrl="/"
      />
<SideBar />
    </div>

  )
}