const BASE_URL = process.env.BASE_URL;
import { init, fetchQuery } from "@airstack/node";
const AIRSTACK_KEY = process.env.AIRSTACK_KEY;
// const BASE_URL = 'https://60f5-97-126-133-99.ngrok-free.app'

init(AIRSTACK_KEY);

export default async function handler (req,res){
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' })
      return
    }
    const signedMessage = req.body;
    let fid = signedMessage.untrustedData.fid
    let submittedUsername = signedMessage.untrustedData.inputText
    let username = await getFarcasterUsername(fid);
    let url = BASE_URL+`/profile?username1=${username}&username2=${submittedUsername}`;
    let html = generateFrame(url);
  
    return res.status(200).setHeader('Content-Type', 'text/html').send(html)
  }
  
function generateFrame(url) {
    let image = BASE_URL+'/continue.jpg';

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${image}" />
        <meta name="fc:frame:button:1" content="See mutuals" />
        <meta name="fc:frame:button:1:action" content="link" />
        <meta name="fc:frame:button:1:target" content="${url}" />
      <body>
      </body>
      </html>
    `
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
