import Sidebar from "./Sidebar";
import './Home.css';
import Chat from "./Chat"

  function Home() {
    return (
        <div className='Home'>
            <Sidebar/>
            <Chat />
        </div>

    )
}
export default Home;