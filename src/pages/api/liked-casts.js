const axios = require('axios');
const { init, fetchQuery } = require("@airstack/node");
const AIRSTACK_KEY = process.env.AIRSTACK_KEY;
init(AIRSTACK_KEY);

export default async function handler(req, res) {
  const { username1, username2 } = req.body;
  console.log(`LIKED CASTS: your Username: ${username1}, Their Username: ${username2}`);

  let yourFid = await getFidFromUsername(username1);
  let theirFid = await getFidFromUsername(username2);

  console.log(`Your FID: ${yourFid}, Their FID: ${theirFid}`);
  let yourLikedCasts = await getLikedCasts(yourFid, theirFid, username2);
  let theirLikedCasts = await getLikedCasts(theirFid, yourFid, username1);

  res.json({ username1: yourLikedCasts, username2: theirLikedCasts });
}

async function getFidFromUsername(username) {
  let query = `{
      Socials(
        input: {filter: {dappName: {_eq: farcaster}, profileName: {_eq: "${username}"}}, blockchain: ethereum}
      ) {
        Social {
          dappName
          userId
        }
      }
    }`
  const { data, error } = await fetchQuery(query);
  return data ? data.Socials.Social[0].userId : '';
}

async function getLikedCasts(fid, targetFid, targetUsername){
  const server = "https://hubs.airstack.xyz";
  try {
    const response = await axios.get(`${server}/v1/reactionsByFid?fid=${fid}&reaction_type=1`, {
      headers: {
        "Content-Type": "application/json",
        // Provide API key here
        "x-airstack-hubs": AIRSTACK_KEY,
      },
    });
      let messages = response.data.messages;
      let castURLs = [];
      for (let message of messages) {
          if (String(message.data.reactionBody.targetCastId.fid) === String(targetFid)) {
              let castURL = `https://warpcast.com/${targetUsername}/${message.data.reactionBody.targetCastId.hash}`
              castURLs.push(castURL)
          }
      }
      return castURLs

  } catch (e) {
    console.error(e);
  }
}