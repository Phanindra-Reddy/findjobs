import React from "react";
import Head from "next/head";
import Footer from "../components/Footer";

const PrivacyPolicy = () => {
  return (
    <>
    <Head>
        <title>Privacy Policy | Find Jobs</title>
        <meta
          name="description"
          content="Find Jobs is online job finding portal. Developed and Designed by Phanindra Reddy."
        />
        <link rel="icon" href="/findjobnavbluewhite.svg" />
      </Head>
      <div className="my-10 px-10 md:px-32">
        <h1 className="text-lg font-medium my-5">PRIVACY NOTICE</h1>
        <p className="text-lg text-slate-600 mb-5">
          Last updated July 11, 2022
        </p>
        <p className="text-md text-slate-600 mb-5">
          Thank you for choosing to be part of our community at FindJobs
          (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or
          &quot;our&quot;). We are committed to protecting your personal
          information and your right to privacy. If you have any questions or
          concerns about this privacy notice or our practices with regard to
          your personal information, please contact us at mpr4070@gmail.com.
        </p>
        <p className="text-md text-slate-600 mb-5">
          This privacy notice describes how we might use your information if
          you:
        </p>
        <p className="text-md text-slate-600 mb-5">
          <ul className="list-disc ml-5">
            <li>Visit our website at mpr-findjobs.vercel.app</li>
          </ul>
        </p>
        <p className="text-md text-slate-600 mb-5">
          In this privacy notice, if we refer to:
        </p>
        <p className="text-md text-slate-600 mb-5">
          <ul className="list-disc ml-5" >
            <li>
              &quot;Website,&quot; we are referring to any website of ours that
              references or links to this policy
            </li>
            <li>
              &quot;App,&quot; we are referring to any application of ours that
              references or links to this policy, including any listed above
            </li>
            <li>
              &quot;Services,&quot; we are referring to our Website, App, and
              other related services, including any sales, marketing, or events
            </li>
          </ul>
        </p>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
