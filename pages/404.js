import React from "react";
import Head from "next/head";
import Footer from "../components/Footer";
import Link from "next/link";

const PageNotFound = () => {


  return (
    <>
    <Head>
        <title>404 Page not found. | Find Jobs</title>
        <meta
          name="description"
          content="Find Jobs is online job finding portal. Developed and Designed by Phanindra Reddy."
        />
        <link rel="icon" href="/findjobnavbluewhite.svg" />
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl md:text-5xl">
          <b className="font-bold font-sans bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
            404 | Page Not Found.
          </b>
          <span>🙂</span>
        </h1>

        <div className="flex items-center justify-center mt-10">
          <Link href="/find-a-job">
            <a className="rounded-md text-xl font-medium py-3 px-10 border-2 border-violet-500 text-white bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-fuchsia-500 hover:to-violet-500">
              Find Job
            </a>
          </Link>
          <Link href="/post-a-job">
            <a className="rounded-md text-xl font-medium py-3 px-10 border-2 border-violet-500 hover:bg-fuchsia-500 ml-5">
              Post a job
            </a>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PageNotFound;
