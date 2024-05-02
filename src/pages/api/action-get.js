const BASE_URL = process.env.BASE_URL;
import { init, fetchQuery } from "@airstack/node";
const AIRSTACK_KEY = process.env.AIRSTACK_KEY;
init(AIRSTACK_KEY);

export default async function handler (req,res){
    if (req.method === 'GET') {
      let metadata = {
        "name": "See what you have in common",
        "icon": "people",
        "description": "See your common channels, likes and follows.",
        "aboutUrl": "https://mutualcaster.vercel.app/",
        "action": {
          "type": "post",
          "postUrl": `${BASE_URL}/api/action-post`
        }
      }
      return res.status(200).setHeader('Content-Type', 'text/html').send(metadata)
    }else if(req.method === 'POST'){
      const signedMessage = req.body;
      let fid = signedMessage.untrustedData.fid
      let username = await getFarcasterUsername(fid);
      let theirFid = signedMessage.untrustedData.castId.fid;
      let theirUsername =await getFarcasterUsername(theirFid);
  
      let url = BASE_URL+`/profile?username1=${username}&username2=${theirUsername}`;
  
      let response = {
        "type": "message",
        "message": "See connection",
        "link": url
      }
  
      console.log(response)
  
      return res.status(200).setHeader('Content-Type', 'text/html').send(response)
    }else{
      res.status(405).json({ error: 'Method Not Allowed' })
      return
    }
  }
  
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
  