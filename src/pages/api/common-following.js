const { init, fetchQuery } = require("@airstack/node");
// const AIRSTACK_KEY = '108689934bdc54609a78f4aa0b25129fc'
const AIRSTACK_KEY = process.env.AIRSTACK_KEY;
init(AIRSTACK_KEY);

export default async function handler(req, res) {
    const { username1, username2 } = req.body;
    console.log(`COMMON FOLLOWING: your Username: ${username1}, Their Username: ${username2}`);
    try {
        const commonFollowing = await getCommonPeopleYouFollow(username1, username2);
        res.json(commonFollowing);
    } catch (error) {
        console.error('Error fetching common people you both follow:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


async function getCommonPeopleYouFollow(username1, username2){
    let query = `query MyQuery {
      followers: SocialFollowings(
        input: {filter: {identity: {_eq: "fc_fname:${username1}"}, dappName: {_eq: farcaster}}, blockchain: ALL, limit: 50}
      ) {
        Following {
          followingAddress {
            socialFollowings(input: {filter: {identity: {_eq: "fc_fname:${username2}"}, dappName: {_eq: farcaster}}}) {
              Following {
                followingAddress {
                  socials {
                    dappName
                    profileName
                    profileImage
                  }
                }
              }
            }
          }
        }
      }
    }`

    const { data, error } = await fetchQuery(query);
    let commonFollowings = [];

    if (data && data.followers && data.followers.Following) {
      for (let following of data.followers.Following) {
        if (following.followingAddress && following.followingAddress.socialFollowings.Following) {
          for(let social of following.followingAddress.socialFollowings.Following[0].followingAddress.socials){
            if(social.dappName === 'farcaster'){
              let name = social.profileName;
              let image = social.profileImage;
              let profile = {name: name, image: image}
              commonFollowings.push(profile)
            }
          }
        }
      }
    }
    return commonFollowings;
}