import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SearchAJob from "./SearchAJob";

const HomePage = () => {
  const [searchParams, setSearchParams] = useState({
    role: "",
    company: "",
    location: "",
  });
  return (
    <>
      <div className="homePageBgImg">
        <div className="flex flex-col md:flex-row items-center justify-between px-5 md:px-20">
          <div className="m-5 md:m-0">
            <h1 className="text-2xl">
              Find a Perfect
              <br />
              <b className="font-bold font-sans text-5xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
                Job For You
              </b>
            </h1>
            <p className="md:w-96 text-left my-5">
              A central location to find jobs with out registration to search
              and apply for jobs. An open platform to search for jobs based on
              your skill, location and company.
            </p>
            <Link href="/find-a-job">
              <a className="rounded-md text-xl font-medium py-3 px-10 border-2 border-violet-500 text-white bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-fuchsia-500 hover:to-violet-500">
                Find Job
              </a>
            </Link>
          </div>
          <Image
            src="/find-jobs-home.webp"
            alt="home"
            width={500}
            height={400}
          />
        </div>
        <div className="my-16">
          <SearchAJob
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
        </div>
      </div>
    </>
  );
};

export default HomePage;
