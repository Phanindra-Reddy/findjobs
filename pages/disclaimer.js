import React from "react";
import Head from "next/head";
import Footer from "../components/Footer";

const Disclaimer = () => {
  return (
    <>
    <Head>
        <title>Disclaimer | Find Jobs</title>
        <meta
          name="description"
          content="Find Jobs is online job finding portal. Developed and Designed by Phanindra Reddy."
        />
        <link rel="icon" href="/findjobnavbluewhite.svg" />
      </Head>
      <div className="my-10 px-10 md:px-32">
        <h1 className="text-lg font-medium my-5">DISCLAIMER</h1>
        <p className="text-lg text-slate-600">Last updated July 11, 2022</p>
        <h1 className="text-lg font-medium my-5">WEBSITE DISCLAIMER</h1>
        <p className="text-md text-slate-600">
          The information provided by FindJobs (“we,” “us”, or “our”) on
          https://mpr-findjobs.vercel.app/ (the “Site”) is for general informational
          purposes only. All information on the Site is provided in good faith,
          however we make no representation or warranty of any kind, express or
          implied, regarding the accuracy, adequacy, validity, reliability,
          availability or completeness of any information on the Site or our
          mobile application. UNDER NO CIRCUMSTANCE SHALL WE HAVE ANY LIABILITY
          TO YOU FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE
          USE OF THE SITE ON ANY INFORMATION PROVIDED ON THE SITE. YOUR USE OF
          THE SITE AND YOUR RELIANCE ON ANY INFORMATION ON THE SITE IS SOLELY AT
          YOUR OWN RISK.
        </p>
      </div>
      <Footer />
    </>
  );
};

export default Disclaimer;
