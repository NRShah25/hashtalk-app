import {UserButton} from "@clerk/nextjs";
import Sidebar from "./Sidebar";
import './SidebarChannel.css';

export default function Home() {
    return (
        <div>
            <UserButton
                afterSignOutUrl="/"
            />
            <Sidebar/>
        </div>

    )
}