import React from "react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <div className="h-56 bg-gradient-to-r from-sky-500 to-indigo-500 text-white flex flex-col items-center justify-center">
      <div className="flex items-center justify-center">
        <Image src="/findjob.svg" alt="findjob" width={50} height={50} />
        <h1 className="text-3xl font-sans font-medium my-2 ml-2 md:ml-5">
          FindJobs
        </h1>
      </div>
      <h5 className="font-sans text-sm text-gray-300 my-2 text-center">
        A platform to get a job easily without registering on any platform.
      </h5>
      <div className="flex flex-wrap items-center justify-center my-2 text-center">
        <Link href="/">
          <a className="hover:underline font-medium mr-2 md:mr-5">Home</a>
        </Link>
        <Link href="/about">
          <a className="hover:underline font-medium mr-2 md:mr-5">About</a>
        </Link>
        <Link href="/disclaimer">
          <a className="hover:underline font-medium mr-2 md:mr-5">Disclaimer</a>
        </Link>
        <Link href="/termsofservice">
          <a className="hover:underline font-medium mr-2 md:mr-5">
            Terms of service
          </a>
        </Link>
        <Link href="/privacypolicy">
          <a className="hover:underline font-medium mr-2 md:mr-5">
            Privacy Policy
          </a>
        </Link>
        <Link href="https://github.com/Phanindra-Reddy/findjobs/issues">
          <a
            target="_blank"
            className="hover:underline font-medium mr-2 md:mr-5"
          >
            Report Bugs/Enhancements
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Footer;
