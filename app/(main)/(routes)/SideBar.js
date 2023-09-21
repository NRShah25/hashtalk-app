import React from 'react';
import "./SideBar.css";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
function SideBar(){
    return (
        <div ClassName = "sidebar">
    <div className="sidebar__top">
    <h3> Main Channel</h3>
        <ExpandMoreIcon />
    </div>
<div className="sidebar__channels">
    <div className="sidebar_channelsHeader">
        <ExpandMoreIcon />
    </div>
</div>
        </div>
    )
}

export default SideBar