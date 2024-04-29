const { init, fetchQuery } = require("@airstack/node");
const AIRSTACK_KEY = process.env.AIRSTACK_KEY;
init(AIRSTACK_KEY);

export default async function handler(req, res) {
  console.log('validate users')
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }
  const { username1, username2 } = req.body;
  console.log('VALIDATING USERS', username1, username2)
  try {
      const isValidUser1 = await validate(username1);
      const isValidUser2 = await validate(username2);
      if (isValidUser1 && isValidUser2) {
          res.json({ valid: true });
      } else {
          res.json({ valid: false });
      }
  } catch (error) {
      console.error('Error validating users:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
}

async function validate(username) {
    let query = `query MyQuery {
      Socials(
        input: {filter: {profileName: {_eq: "${username}"}, dappName: {_eq: farcaster}}, blockchain: ethereum}
      ) {
        Social {
          profileName
        }
      }
    }`
  
    const { data, error } = await fetchQuery(query);
    if(data.Socials.Social) return true;
    else return false;
  
      // First validation method
  }