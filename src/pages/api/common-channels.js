const { init, fetchQuery } = require("@airstack/node");
const AIRSTACK_KEY = process.env.AIRSTACK_KEY;
init(AIRSTACK_KEY);

export default async function handler(req, res) {
    const { username1, username2 } = req.body;
    console.log(`COMMON CHANNELs: your Username: ${username1}, Their Username: ${username2}`);
    try {
        let commonChannels = await getCommonChannels(username1, username2)
        res.json(commonChannels);
    } catch (error) {
      console.error('Error fetching common following:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
}

async function getCommonChannels(username1, username2) {
    let query = `{
        vmathur: FarcasterChannelParticipants(
          input: {filter: {participant: {_eq: "fc_fname:${username1}"}}, blockchain: ALL, limit: 50}
        ) {
          FarcasterChannelParticipant {
            channel {
              participants(input: {filter: {participant: {_eq: "fc_fname:${username2}"}}}) {
                channel {
                  name
                  imageUrl
                  url
                }
              }
            }
          }
        }
      }`
    const { data, error } = await fetchQuery(query);
    let commonChannels = []
    let rawData = data.vmathur.FarcasterChannelParticipant;
    rawData.forEach(item => {
      if (item.channel.participants) {
          commonChannels.push({name: item.channel.participants[0].channel.name, imageUrl: item.channel.participants[0].channel.imageUrl, url: item.channel.participants[0].channel.url});
      }
    });
    return commonChannels;
}