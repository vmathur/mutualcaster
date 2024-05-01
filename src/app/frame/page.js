import Head from 'next/head';

export default function Frame() {
    let BASE_URL = process.env.NEXT_PUBLIC_API_URL
    // let BASE_URL = 'https://60f5-97-126-133-99.ngrok-free.app'

    return (
        <div>
        <head>
            <meta property="og:title" content="Mutualcaster" />
            <meta property="og:image" content={`${BASE_URL}/welcome.jpg`} />
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content={`${BASE_URL}/welcome.jpg`} />
            <meta property="fc:frame:input:text" content="Enter a user name" />
            <meta property="fc:frame:button:1" content="Go" />
            <meta property="fc:frame:post_url" content={`${BASE_URL}/api/frame`} />
        </head>
        Frame
        </div>
    );
}