import Head from "next/head";
import Footer from "../components/Footer";
import HomePage from "../components/HomePage";

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
      <>
        <HomePage />
        <Footer />
      </>
    </>
  );
}
