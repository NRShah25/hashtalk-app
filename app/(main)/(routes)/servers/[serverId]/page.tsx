import Sidebar from "@/app/(main)/(routes)/Sidebar";
import '@/app/(main)/(routes)/Home.css';
import Chat from "@/app/(main)/(routes)/Chat"
import ServerBar from "@/app/(main)/(routes)/ServerBar"
const ServerIdPage = () => {
    return (
        <div className='Home'>
            <header>
                <ServerBar/>
            </header>

            <Sidebar/>
            <Chat/>

        </div>    );
}

export default ServerIdPage;