import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../styles/globals.css";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "../hooks/AuthContext";


function MyApp({ Component, pageProps }) {
  return (
    <>
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
