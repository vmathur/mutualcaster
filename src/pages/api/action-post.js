const BASE_URL = process.env.BASE_URL;
import { init, fetchQuery } from "@airstack/node";
const AIRSTACK_KEY = process.env.AIRSTACK_KEY;
init(AIRSTACK_KEY);

export default async function handler (req,res){
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' })
      return
    }

    const signedMessage = req.body;
    let fid = signedMessage.untrustedData.fid
    let username = await getFarcasterUsername(fid);
    let theirFid = signedMessage.untrustedData.untrustedData.castId.fid;
    let theirUsername =await getFarcasterUsername(theirFid);

    let url = BASE_URL+`/profile?username1=${username}&username2=${theirUsername}`;

    let response = {
      "type": "message",
      "message": "See connection",
      "link": url
    }

    console.log(response)

    return res.status(200).setHeader('Content-Type', 'text/html').send(response)
  }
  

  https://warpcast.com/~/add-cast-action?url=https://2df8-172-56-108-162.ngrok-free.app/api/action-get
  async function getFarcasterUsername(fid){
    const query = `{
      Socials(
        input: {filter: {userId: {_eq: "${fid}"}, dappName: {_eq: farcaster}}, blockchain: ethereum}
      ) {
        Social {
          dappName
          profileName
        }
      }
    }`;
    const { data, error } = await fetchQuery(query);
    return data ? data.Socials.Social[0].profileName : '';
  }
  