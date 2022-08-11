import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Footer from "../components/Footer";

const About = () => {
  return (
    <>
      <Head>
        <title>About | Find Jobs</title>
        <meta
          name="description"
          content="Find Jobs is online job finding portal. Developed and Designed by Phanindra Reddy."
        />
        <link rel="icon" href="/findjobnavbluewhite.svg" />
      </Head>
      <div>
        <div className="bg-white border rounded-lg border-gray-300 p-5 md:px-10 m-4 md:m-10">
          <div className="flex items-center justify-between">
            <h1 className="mb-2 text-3xl font-medium underline">About</h1>
            <Image
              src="/myimage.jpg"
              alt="Phanindra Reddy"
              width={50}
              height={50}
            />
          </div>
          <p className="text-lg">
            Hi, I&apos;m{" "}
            <Link href="https://phanindra.vercel.app/">
              <a target="_blank" className="text-blue-600 hover:underline">
                Phanindra Reddy.{" "}
              </a>
            </Link>
            Currently working as a Front end developer (Reactjs).
          </p>
          <br />
          <p className="text-slate-500 text-lg">
            The main intention behind building this project is to help the
            community to find jobs in different domains. My sincere request to
            you all is to just post the jobs on this platform when there are any
            openings in your company (I mean just from your company, whether it
            is fresher or more experienced).
          </p>
          <div className="my-5">
            <h2 className="font-medium underline text-md">Tech Stack Used:</h2>
            <div className="flex items-center mt-2">
              <Image src="/nextjs.webp" alt="Next.js" width={50} height={50} />

              <Image
                src="/tailwindcss.png"
                alt="TailwindCSS"
                width={50}
                height={50}
              />
              <Image src="/firebase.svg" alt="Fiebase" width={50} height={50} />
            </div>
          </div>
          <p>
            Note:{" "}
            <span>
              Any one who seen this project please reach out to me, because I
              want to take this to next level. I want you to build
              backend(including DB) using Java or Nodejs or Golang or any Server
              side language.
            </span>
          </p>
          <p className="mt-5">
            <span>Front-end: Nextjs and TailwindCSS.</span>
            <br />
            <span>Back-end: Any server side language(your choice).</span>
          </p>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default About;
