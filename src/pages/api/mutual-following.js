const { init, fetchQuery } = require("@airstack/node");
const AIRSTACK_KEY = process.env.AIRSTACK_KEY;
init(AIRSTACK_KEY);

export default async function handler(req, res) {
    const { username1, username2 } = req.body;
    console.log(`MUTUAL FOLLOWING: your Username: ${username1}, Their Username: ${username2}`);
    try {
      const followingSince1 = await getMutualFollowing(username1, username2);
      const followingSince2 = await getMutualFollowing(username2, username1);
      // const followingSince2 = '12345';
      res.json({ username1: followingSince1, username2: followingSince2 });
    } catch (error) {
      console.error('Error fetching common following:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
}


async function getMutualFollowing(username1, username2){
    let query = `{
        Wallet(input: {identity: "fc_fname:${username1}", blockchain: ethereum}) {
          socialFollowers( # Check if fc_fname:ipeciura.eth is a follower of these user identities on Lens
            input: {filter: {identity: {_in: ["fc_fname:${username2}"]}, dappName: {_eq: farcaster}}}
          ) {
            Follower {
              followerSince
            }
          }
        }
      }`

    const { data, error } = await fetchQuery(query);
    return data && data.Wallet.socialFollowers.Follower ? data.Wallet.socialFollowers.Follower[0].followerSince : '';
}
