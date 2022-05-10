import React from "react";
import { useMoralis } from "react-moralis";
import { Link } from "react-router-dom";
import { Icon } from "web3uikit";
import { defaultImgs } from "../defaultimgs";
import './Sidebar.css';


const Sidebar = () => {
  const { Moralis } = useMoralis();
  const user = Moralis.User.current();

  const shortenAddress = (address) => {
    if (!address) return "";
    return address.slice(0, 5) + "..." + address.slice(address.length - 4);
  }

  return (
    <>
      <div className="siderContent">
        <div className="menu">
          <div className="details">
            <Icon fill="#FFFFFF" size={33} svg="twitter" />
          </div>
          <Link to="/" className="link">
            <div className="menuItems">
              <Icon fill="#FFFFFF" size={33} svg="list" />
              Home
            </div>
          </Link>
          <Link to="/profile" className="link">
            <div className="menuItems">
              <Icon fill="#FFFFFF" size={33} svg="user" />
              Profile
            </div>
          </Link>
          <Link to="/settings" className="link">
            <div className="menuItems">
              <Icon fill="#FFFFFF" size={33} svg="cog" />
              Settings
            </div>
          </Link>
        </div>

        <div className="details">
          <img className="profilePic" src={user.attributes.pfp ? user.attributes.pfp : defaultImgs[0]} />
          <div className="profile">
            <div className="who">
              {user.attributes.username.slice(0, 6)}
            </div>
            <div className="accWhen">
              {shortenAddress(user.attributes.ethAddress)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

