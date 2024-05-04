const BASE_URL = process.env.BASE_URL;
const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;

export default async function handler (req,res){
    let state = req.body.untrustedData.state
    if(state==='top'){
        const image = req.query.image;
        const templateId = req.query.templateId;
        let text1 = req.body.untrustedData.inputText
        let frame = generateFrame2(image, templateId, text1)    
        return res.status(200).setHeader('Content-Type', 'text/html').send(frame)
    }else if (state==='bottom'){
        const image = req.query.image;
        const templateId = req.query.templateId;
        const text1 = req.query.text1;
        let text2 = req.body.untrustedData.inputText

        let meme = await makeMeme(templateId, text1, text2)
        let html = generateFinal(meme);
        return res.status(200).setHeader('Content-Type', 'text/html').send(html)
    }else{
        res.status(500)
    }
}

function generateFrame2(image, templateId, text1, text2) {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <meta property="og:title" content="Memecaster" />
        <meta property="og:image" content=${image} />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:state" content="bottom" />
        <meta property="fc:frame:image" content=${image} />
        <meta property="fc:frame:input:text" content="Enter bottom text text" />
        <meta property="fc:frame:button:1" content="Go" />
        <meta property="fc:frame:post_url" content=${BASE_URL}/api/makeMeme?templateId=${templateId}&image=${image}&text1=${text1} />
      <body>
      </body>
      </html>
    `
}

function generateFinal(image) {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <meta property="og:title" content="Memecaster" />
        <meta property="og:image" content=${image} />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:state" content="final" />
        <meta property="fc:frame:image" content=${image} />
        <meta name="fc:frame:button:1" content="Get meme" />
        <meta name="fc:frame:button:1:action" content="link" />
        <meta name="fc:frame:button:1:target" content=${image} />
      <body>
      </body>
      </html>
    `
}
  
async function makeMeme(templateId, text1,text2) {
    let password = 'S*mi7pGR$ME!wNuf'
    let imgflipUsername = 'vmmonkey'

    const formData = new URLSearchParams();
    formData.append('username', imgflipUsername);
    formData.append('password', password);
    formData.append('template_id', templateId);
    formData.append('text0', text1);
    formData.append('text1', text2);

    try {
        const response = await fetch('https://api.imgflip.com/caption_image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData,
        });
  
        const data = await response.json();
        if (data.success) {
          console.log('Meme created successfully');
          let image = data.data.url;
          return image;
        } else {
          console.error('Failed to fetch memes:', data.error_message);
        }
      } catch (error) {
        console.error('Error making HTTP request:', error);
      }
}

