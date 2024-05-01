import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "Mutualcaster",
//   description: "See what you have in common with other Farcaster users",
//   icons: {
//     icon: '/favicon.ico',
//   },
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <meta name="description" content="See what you have in common with other Farcaster users"/>
        <title>Mutualcaster</title>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
