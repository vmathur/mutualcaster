const { init, fetchQuery } = require("@airstack/node");
const AIRSTACK_KEY = process.env.AIRSTACK_KEY;
init(AIRSTACK_KEY);

export default async function handler(req, res) {
  const { username1, username2 } = req.body;
  console.log(`PROFILE PICS: your Username: ${username1}, Their Username: ${username2}`);
  try {
      let profilePictures = await getProfilePictures(username1, username2)
      res.json(profilePictures);
  } catch (error) {
    console.error('Error fetching profile pictures:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  
}

async function getProfilePictures(username1, username2){
  let query = `{
      Socials(
        input: {filter: {identity: {_in: ["fc_fname:${username1}", "fc_fname:${username2}"]}, dappName: {_eq: farcaster}}, blockchain: ethereum}
      ) {
        Social {
          profileName
          profileImage
        }
      }
    }`
    const { data, error } = await fetchQuery(query);
    return data && data.Socials.Social ? { username1: data.Socials.Social[0].profileImage, username2: data.Socials.Social[1].profileImage } : '';
}