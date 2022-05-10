import React, { useRef, useState } from "react";
import "./Home.css";
import { defaultImgs } from "../defaultimgs";
import { Icon, TextArea } from "web3uikit";
import TweetInFeed from "../components/TweetInFeed";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import TweetsABI from "../tweetsABI.json"

const Home = () => {
  const { Moralis } = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();
  const user = Moralis.User.current();
  const inputFile = useRef();
  const [selectedFile, setSelectedFile] = useState();
  const [theFile, setTheFile] = useState();
  const [tweet, setTweet] = useState();

  const changeHandler = (event) => {
    const img = event.target.files[0];
    setTheFile(img);
    setSelectedFile(URL.createObjectURL(img));
  }

  const onImageClick = () => {
    inputFile.current.click();
  }

  const saveTweet = async () => {
    if (!tweet) return;
    const Tweets = Moralis.Object.extend("Tweets");
    const newTweet = new Tweets();
    newTweet.set("tweetTxt", tweet);
    newTweet.set("tweeterPfp", user.attributes.pfp);
    newTweet.set("tweeterAcc", user.attributes.ethAddress);
    newTweet.set("tweeterUserName", user.attributes.username)

    if (theFile) {
      const data = theFile;
      const file = new Moralis.File(data.name, data);
      await file.saveIPFS();
      newTweet.set("tweetImg", file.ipfs());
    }

    await newTweet.save();
    window.location.reload();
  }

  const maticTweet = async () => {
    if (!tweet) return;
    let img;
    if (theFile) {
      const data = theFile;
      const file = new Moralis.File(data.name, data);
      await file.saveIPFS();
      img = file.ipfs();
    } else {
      img = "No Image";
    }

    await contractProcessor.fetch({
      params: {
        contractAddress: "0x4FE981523C96592730666931ce36b0372532e3D0",
        functionName: "addTweet",
        abi: TweetsABI,
        params: {
          tweetText: tweet,
          tweetImage: img,
        },
        msgValue: Moralis.Units.ETH(1),
      },
      onSuccess: () => {
        saveTweet();
      },
      onError: (error) => {
        console.error(error);
      }
    })
  }

  return (
    <>
      <div className="pageIdentify">Home</div>
      <div className="mainContent">
        <div className="profileTweet">
          <img
            src={user.attributes.pfp ? user.attributes.pfp : defaultImgs[0]}
            className="profilePic" />
          <div className="tweetBox">
            <TextArea
              label=""
              name="tweetTxtArea"
              value="GM World"
              type="text"
              width="95%"
              onChange={(e) => setTweet(e.target.value)}
            />
            {
              selectedFile && (
                <img src={selectedFile} className="tweetImg" />
              )
            }
            <div className="imgOrTweet">
              <div className="imgDiv" onClick={onImageClick}>
                <input
                  type="file"
                  name="file"
                  ref={inputFile}
                  onChange={changeHandler}
                  style={{
                    display: "none",
                  }}
                />
                <Icon fill="#1DA1F2" size={20} svg="image" />
              </div>
              <div className="tweetOptions">
                <div className="tweet" onClick={saveTweet}>Tweet</div>
                <div className="tweet"
                  onClick={maticTweet}
                  style={{
                    backgroundColor: "#8247E5",
                  }}>
                  <Icon fill="#FFFFFF" size={20} svg="matic" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <TweetInFeed profile={false} />
      </div>
    </>
  );
};

export default Home;
