const BASE_URL = process.env.BASE_URL;

//https://warpcast.com/~/add-cast-action?url=https://memecaster.vercel.app/api/action-get
//https://warpcast.com/~/add-cast-action?url=https://9f4f-23-118-14-164.ngrok-free.app/api/action-get

export default async function handler (req,res){
    if (req.method === 'GET') {
      console.log('sup')
      let url = BASE_URL+'/api/action-get';

      let metadata = {
        "name": "Make a meme",
        "icon": "paintbrush",
        "description": "Make memes",
        "aboutUrl": "https://memecaster.vercel.app/",
        "action": {
          "type": "post",
          "postUrl": url
        }
      }
      return res.status(200).setHeader('Content-Type', 'text/html').send(metadata)
    }else if(req.method === 'POST'){
      let response = {
        "type": "frame",
        "frameUrl": BASE_URL+'/api/frame'
      }
      return res.status(200).setHeader('Content-Type', 'text/html').send(response)
    }else{
      res.status(405).json({ error: 'Method Not Allowed' })
      return
    }
  }

