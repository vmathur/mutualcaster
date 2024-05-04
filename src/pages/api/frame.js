const BASE_URL = process.env.BASE_URL;

export default async function handler (req,res){
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' })
      return
    }
    let html = generateFrame()
    return res.status(200).setHeader('Content-Type', 'text/html').send(html)
  }
  
  function generateFrame() {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta property="og:title" content="Memecaster" />
        <meta property="og:image" content=${BASE_URL}/welcome.jpg />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content=${BASE_URL}/search.jpg />
        <meta property="fc:frame:input:text" content="Enter a meme" />
        <meta property="fc:frame:button:1" content="Go" />
        <meta property="fc:frame:post_url" content=${BASE_URL}/api/getMemes />
      </head>
      <body>
      </body>
      </html>
    `
}