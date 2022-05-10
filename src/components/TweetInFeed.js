import { useEffect, useState } from "react";
import golf from "../images/golf.png";
import { defaultImgs } from "../defaultimgs";
import './TweetInFeed.css';
import { Icon } from "web3uikit";
import { useMoralis } from "react-moralis";


const TweetInFeed = ({ profile }) => {
  const [tweets, setTweets] = useState([]);
  const { Moralis, account } = useMoralis();

  const shortenAddress = (address) => {
    if (!address) return "";
    return address.slice(0, 5) + "..." + address.slice(address.length - 4);
  }

  useEffect(() => {
    const getTweets = async () => {
      try {
        const Tweets = Moralis.Object.extend("Tweets");
        const query = new Moralis.Query(Tweets);
        if (profile) {
          query.equalTo("tweeterAcc", account);
        }
        const results = await query.find();
        setTweets(results);
        console.log(results);
      } catch (error) {
        console.error(error);
      }
    }
    getTweets();
  }, [])

  return (
    <>
      {
        tweets.map((tweet, tweetKey) => {
          return (
            <div className="feedTweet" key={tweetKey}>
              <img src={tweet.attributes.tweeterPfp ? tweet.attributes.tweeterPfp : defaultImgs[0]} className="profilePic" />
              <div className="completeTweet">
                <div className="who">
                  {tweet.attributes.tweeterUserName.slice(0, 6)}
                  <div className="accWhen">
                    {`
                    ${shortenAddress(tweet.attributes.tweeterAcc)} . 
                    ${tweet.attributes.createdAt.toLocaleString('en-us', { month: 'short' })}
                    ${tweet.attributes.createdAt.toLocaleString('en-us', { day: 'numeric' })}
                    `}
                  </div>
                </div>
                <div className="tweetContent">
                  {tweet.attributes.tweetTxt}
                  {
                    tweet.attributes.tweeterImg && (
                      <img src={tweet.attributes.tweetImg} className="tweetImg" />
                    )
                  }
                </div>
                <div className="interactions">
                  <div className="interactionNums">
                    <Icon fill="#3f3f3f" size={20} svg="messageCircle" />
                  </div>
                  <div className="interactionNums">
                    <Icon fill="#3f3f3f" size={20} svg="star" />
                    12
                  </div>
                  <div className="interactionNums">
                    <Icon fill="#3f3f3f" size={20} svg="matic" />
                  </div>
                </div>
              </div>
            </div>
          )
        }).reverse()
      }
      {/* <div className="feedTweet">
        <img src={defaultImgs[0]} className="profilePic" />
        <div className="completeTweet">
          <div className="who">
            Juhizz
            <div className="accWhen">0x213123...123123 . 1h</div>
          </div>
          <div className="tweetContent">
            Nice day godlfdsfa
            <img src={golf} className="tweetImg" />
          </div>
          <div className="interactions">
            <div className="interactionNums">
              <Icon fill="#3f3f3f" size={20} svg="messageCircle" />
            </div>
            <div className="interactionNums">
              <Icon fill="#3f3f3f" size={20} svg="star" />
              12
            </div>
            <div className="interactionNums">
              <Icon fill="#3f3f3f" size={20} svg="matic" />
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default TweetInFeed;

