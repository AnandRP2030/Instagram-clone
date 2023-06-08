import Tweet from "./tweets";
import { useState, useEffect } from "react";
// import '~video-react/dist/video-react.css';
import { Player } from "video-react";
import axios from "axios";
import { store } from "../../../Redux/store.js";

const HomeTweets = ({tweetIdentity}) => {
  const [commentBoxIndex, setCommentBoxIndex] = useState(-1);
  const toggleCommentBox = (index) => {
    setCommentBoxIndex((prevIndex) => (prevIndex === index ? -1 : index));
  };

  const findTweetCount = () => {
    return store.getState().tweets.newTweetsCount;
  };

  const [newTweetCount, setNewTweetCount] = useState(findTweetCount());

  const unSubscribe = store.subscribe(() => {
 
   const count = findTweetCount();
    setNewTweetCount(count);
  });

  const [allTweets, setAllTweets] = useState([]);
  useEffect(() => {
    collectData();
  }, [newTweetCount]);

  const collectData = async () => {
    let token = localStorage.getItem("token").replaceAll('"', "");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    let GET_ALL_TWEETS = `${import.meta.env.VITE_BASE_URL}/user/tweets`;
    const data = await axios.get(GET_ALL_TWEETS, config);
    displayContent(data.data);
  };

  const displayContent = (data) => {
    
    const {tweets, ownersInfo, tweetsStatus} = data;
    let Tweets = [];
    for (let i = tweets.length - 1; i >= 0; i--) {
      let { username, name, email, _id, profilePicture } = ownersInfo[i]._doc;
      
      let ownerData = {
        username,
        name,
        email,
        userId: _id,
        profilePicture,
      };

      let tweet = {
        content: tweets[i].content,
        comments: tweets[i].comments,
        totalNoCmts: tweets[i].comments.length,
        likes: tweets[i].likes.length,
        retweets: tweets[i].retweets.length,
        views: tweets[i].views,
        isPrivate: tweets[i].private,
        tweetId: tweets[i]._id,
        imageUrls: tweets[i].imageUrls,
        videoUrls: tweets[i].videoUrls,
        tweetOwner: ownerData,
        tweetStatus: tweetsStatus[i],
      };

      if (tweetIdentity) {
        if (tweetIdentity === tweet.tweetId) {
         
          Tweets.push(tweet);
          break;
        }
      }else {
        Tweets.push(tweet);
      }

    }
    setAllTweets(Tweets);
  };

  return (
    <>
      {allTweets?.map((elem, idx) => {
        return (
          <Tweet
            key={elem.tweetId}
            index={idx}
            tweetInfo={elem}
            commentBoxIndex={commentBoxIndex}
            toggleCommentBox={toggleCommentBox}
          />
        );
      })}
    </>
  );
};

export default HomeTweets;
