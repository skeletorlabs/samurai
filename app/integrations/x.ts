"use client";
import { TwitterApi } from "twitter-api-v2";

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY as string,
  appSecret: process.env.TWITTER_API_SECRET as string,
  accessToken: process.env.TWITTER_APP_ACCESS_TOKEN as string,
  accessSecret: process.env.TWITTER_APP_ACCESS_TOKEN_SECRET as string,
});

export default async function hasEngaged(tweetId: string, username: string) {
  // Check ids
  const user = await twitterClient.v2.userByUsername(username.replace("@", "")); // Remove @ if included
  const userId = user.data.id;

  let engaged = false;

  try {
    // Check likes
    const likingUsers = await twitterClient.v2.tweetLikedBy(tweetId, {
      "user.fields": "id",
    });
    const liked = likingUsers.data.some((user) => user.id === userId);

    // Check retweets
    const retweetingUsers = await twitterClient.v2.tweetRetweetedBy(tweetId, {
      "user.fields": "id",
    });
    const retweeted = retweetingUsers.data.some((user) => user.id === userId);

    if (liked || retweeted) {
      engaged = true;
    }

    return engaged;
  } catch (error) {
    console.error("Twitter API error:", error);
    return false; // Handle error gracefully
  }
}
