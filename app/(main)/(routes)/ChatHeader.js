import React from "react";
import "./ChatHeader.css"
import NotificationsIcon from '@mui/icons-material/Notifications'
import EditLocationAltRoundedIcon from '@mui/icons-material/EditLocationAltRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
function ChatHeader(){
    return(
        <div className="chatHeader">
            <div className="cheaderhatHeader__left">
                <h3><span className="chatHeader__hash">
                    #
                </span>
                    Current Channel
                </h3>
            </div>
            <div className="chatHeader__right">
                <NotificationsIcon />
                <EditLocationAltRoundedIcon />
                <PeopleAltRoundedIcon />

                <div className="chatHeader__search">
                    <input placeholder = 'Search' />
                    <SearchRoundedIcon />
                </div>
                <SendRoundedIcon />
                <HelpRoundedIcon />
            </div>
        </div>
    )
}
export default ChatHeader;