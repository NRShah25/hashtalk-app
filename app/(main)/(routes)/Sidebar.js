import React from 'react';
import {UserButton} from "@clerk/nextjs";
import "./SideBar.css";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import SidebarChannel from "@/app/(main)/(routes)/SidebarChannel";

function Sidebar() {
    return (<div className="sidebar">
        <div className="sidebar__top">
            <h3> Main Channel</h3>
            <ExpandMoreIcon/>
        </div>
        <div className="sidebar__channels">
            <div className="sidebar__channelsHeader">
                <div className="sidebar__header">
                    <ExpandMoreIcon/>
                    <h4>
                        Channel Group
                    </h4>
                </div>
                <AddIcon className="sidebar__addChannel"/>
            </div>
            <div className="sidebar__channelsList">
                <SidebarChannel/>
                <SidebarChannel/>
            </div>
        </div>
        <div className = 'sidebar__profile'>
            <UserButton
                afterSignOutUrl="/"
            />
            <div className="sidebar__profileInfo">
                <h3> User</h3>
                <p>#34625</p>
            </div>

        </div>
    </div>)
}

export default Sidebar