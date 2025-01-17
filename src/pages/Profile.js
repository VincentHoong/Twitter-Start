import React from "react";
import { useMoralis } from "react-moralis";
import { Link } from "react-router-dom";
import TweetInFeed from "../components/TweetInFeed";
import { defaultImgs } from "../defaultimgs";
import './Profile.css';


const Profile = () => {
  const { Moralis } = useMoralis();
  const user = Moralis.User.current();

  const shortenAddress = (address) => {
    if (!address) return "";
    return address.slice(0, 5) + "..." + address.slice(address.length - 4);
  }

  return (
    <>
      <div className="pageIdentify">Profile</div>
      <img className="profileBanner" src={user.attributes.banner ? user.attributes.banner : defaultImgs[1]} />
      <div className="pfpContainer">
        <img className="profilePFP" src={user.attributes.pfp ? user.attributes.pfp : defaultImgs[0]} />
        <div className="profileName">{user.attributes.username.slice(0, 6)}</div>
        <div className="profileWallet">{shortenAddress(user.attributes.ethAddress)}</div>
        <Link to="/settings">
          <div className="profileEdit">Edit Profile</div>
        </Link>
        <div className="profileBio">
          Your Average Web3 Mage
        </div>
        <div className="profileTabs">
          <div className="profileTab">
            Your Tweets
          </div>
        </div>
      </div>
      <TweetInFeed profile={true}></TweetInFeed>
    </>
  );
};

export default Profile;

