import Head from "next/head";
import Footer from "../components/Footer";
import HomePage from "../components/HomePage";
import Script from "next/script";

export default function Home() {
  return (
    <>
      <Head>
        <title>Find Jobs | Developed and Designed by Phanindra Reddy</title>
        <meta
          name="description"
          content="Find Jobs is online job finding portal. Developed and Designed by Phanindra Reddy."
        />
        <link rel="icon" href="/findjobnavbluewhite.svg" />
      </Head>
      {/* <!-- Google tag (gtag.js) --> */}
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-LR8SQ4TQHD"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-LR8SQ4TQHD');
  `}
      </Script>
      <>
        <HomePage />
        <Footer />
      </>
    </>
  );
}
