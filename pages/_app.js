import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../styles/globals.css";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "../hooks/AuthContext";
import Script from "next/script";

function MyApp({ Component, pageProps }) {
  return (
    <>
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
      <AuthProvider>
        <ToastContainer />
        <Navbar />
        <Component {...pageProps} />
        {/* <Footer /> */}
      </AuthProvider>
    </>
  );
}

export default MyApp;
