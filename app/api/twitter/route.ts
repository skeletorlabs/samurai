import { TwitterApi } from "twitter-api-v2";
import Twitter from "twitter-v2";

import { NextRequest } from "next/server";

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY as string,
  appSecret: process.env.TWITTER_API_SECRET as string,
  accessToken: process.env.TWITTER_APP_ACCESS_TOKEN as string,
  accessSecret: process.env.TWITTER_APP_ACCESS_TOKEN_SECRET as string,
});

const client = new Twitter({
  consumer_key: process.env.TWITTER_API_KEY as string,
  consumer_secret: process.env.TWITTER_API_SECRET as string,
  access_token_key: process.env.TWITTER_APP_ACCESS_TOKEN as string,
  access_token_secret: process.env.TWITTER_APP_ACCESS_TOKEN_SECRET as string,
});

// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url);
//   const username = searchParams.get("username");

//   if (!username) {
//     return new Response("Username is required", { status: 400 });
//   }
//   const tweetId = searchParams.get("tweetId");

//   if (!tweetId) {
//     return new Response("Tweet ID is required", { status: 400 });
//   }
//   // Check if the username starts with '@'
//   if (username.startsWith("@")) {
//     return new Response("Username should not start with '@'", { status: 400 });
//   }

//   // Check if the username is valid
//   const user = await twitterClient.v2.userByUsername(username);
//   if (!user) {
//     return new Response("Invalid username", { status: 400 });
//   }

//   // Check ids
//   const userId = user.data.id;
//   if (!userId) {
//     return new Response("User ID not found", { status: 400 });
//   }
//   // Check if the tweetId is valid
//   const tweet = await twitterClient.v2.singleTweet(tweetId);
//   if (!tweet) {
//     return new Response("Invalid tweet ID", { status: 400 });
//   }
//   // Check if the tweetId is a valid tweet
//   if (!tweet.data) {
//     return new Response("Invalid tweet ID", { status: 400 });
//   }

//   console.log(tweet.data);

//   let engaged = false;
//   let liked = false;
//   let retweeted = false;

//   const likedBy = await fetch(
//     "https://api.twitter.com/2/tweets/1910349054095278415/liking_users?user.fields=id",
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.TWITTER_APP_BEARER_TOKEN}`,
//       },
//     }
//   );

//   console.log("likedBy", likedBy);

//   //api.twitter.com/2/liking_users/:id?expansions=author_id,geo.place_id&user.fields=created_at,description,entities,location

//   // Check likes
//   // const likingUsers = await twitterClient.v2.tweetLikedBy(tweetId, {
//   //   "user.fields": "id",
//   // });
//   // console.log("likingUsers", likingUsers.data);
//   // liked = likingUsers.data.some((user) => user.id === userId);
//   // console.log(liked);

//   // // Check retweets
//   // const retweetingUsers = await twitterClient.v2.tweetRetweetedBy(tweetId, {
//   //   "user.fields": "id",
//   // });
//   // console.log("retweetingUsers", retweetingUsers.data);
//   // retweeted = retweetingUsers.data.some((user) => user.id === userId);

//   // console.log(retweeted);

//   https: if (liked && retweeted) engaged = true;

//   // return engaged;
//   return new Response(JSON.stringify({ engaged, liked, retweeted }), {
//     status: 200,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
// }

export type TwitterEngagement = {
  engaged: boolean;
  liked: boolean;
  retweeted: boolean;
};
export async function GET(request: NextRequest) {
  let engaged = false;
  let liked = false;
  let retweeted = false;

  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return new Response("Username is required", { status: 400 });
    }
    const tweetId = searchParams.get("tweetId");

    if (!tweetId) {
      return new Response("Tweet ID is required", { status: 400 });
    }
    // Check if the username starts with '@'
    if (username.startsWith("@")) {
      return new Response("Username should not start with '@'", {
        status: 400,
      });
    }

    let engaged = false;

    // users/by/username/:username
    const user: { data: { id: string } } = await client.get(
      "users/by/username/" + username
    );
    if (!user) {
      return new Response("Invalid username", { status: 400 });
    }

    // users/:id/liked_tweets
    const likes: { data: { id: string }[] } = await client.get(
      `users/${user.data.id}/liked_tweets`
    );

    liked = likes.data.some((like) => like.id === tweetId);

    // tweets/1354143047324299264/retweeted_by
    const retweets: { data: { username: "0x_theL" }[] } = await client.get(
      `tweets/${tweetId}/retweeted_by?user.fields=id`
    );

    retweeted = retweets.data.some((retweet) => retweet.username === username);

    console.log("liked", liked);
    console.log("retweeted", retweeted);

    if (liked && retweeted) engaged = true;
    console.log("engaged", engaged);

    // return engaged;
    return new Response(JSON.stringify({ engaged, liked, retweeted }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ engaged, liked, retweeted }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
