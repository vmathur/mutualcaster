const BASE_URL = process.env.BASE_URL;
const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD

export default async function handler (req,res){
    let memeQuery = req.body.untrustedData.inputText
    // let memeQuery = req.body.value
    let password = 'S*mi7pGR$ME!wNuf'
    let imgflipUsername = 'vmmonkey'

    const formData = new URLSearchParams();
    formData.append('username', imgflipUsername);
    formData.append('password', password);
    formData.append('query', memeQuery);

    try {
      const response = await fetch('https://api.imgflip.com/search_memes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        console.log('Memes fetched successfully:');

        let memes = data.data.memes;
        let html = generateFrame(memes[0])
        return res.status(200).setHeader('Content-Type', 'text/html').send(html)

      } else {
        console.error('Failed to fetch memes:', data.error_message);
      }
    } catch (error) {
      console.error('Error making HTTP request:', error);
    }


  }
  

function generateFrame(meme) {
    let templateId = meme.id
    let image = meme.url

    return `
      <!DOCTYPE html>
      <html lang="en">
        <meta property="og:title" content="Memecaster" />
        <meta property="og:image" content=${image} />
        <meta property="fc:frame:state" content="top" />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content=${image} />
        <meta property="fc:frame:input:text" content="Enter top text" />
        <meta property="fc:frame:button:1" content="Go" />
        <meta property="fc:frame:post_url" content=${BASE_URL}/api/makeMeme?templateId=${templateId}&image=${image} />
      <body>
      </body>
      </html>
    `
}