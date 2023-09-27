import Sidebar from "./Sidebar";
import './Home.css';
import Chat from "./Chat"
import ServerBar from "./ServerBar"

  function Home() {
    return (
        <div className='Home'>
            <header>
                <ServerBar/>
            </header>
            <Sidebar/>
            <Chat/>





        </div>

    )
}
export default Home;