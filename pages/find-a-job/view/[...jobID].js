import React, { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuth } from "../../../hooks/AuthContext";
import { firestore } from "../../../utils/firebase";
import {
  collection,
  query,
  getDocs,
  collectionGroup,
} from "firebase/firestore";
import Link from "next/link";
import ReactHtmlParser from "react-html-parser";
import { BiLinkExternal } from "react-icons/bi";
import { notifyError } from "../../../utils/toasters";
import Image from "next/image";

const ViewJobId = () => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const { jobID } = router.query;

  const [isLoading, setIsLoading] = useState(false);
  const [filteredJob, setFilteredJob] = useState([]);

  const fetchDocument = useCallback(async () => {
    setIsLoading(true);

    try {
      const res = query(collectionGroup(firestore, "jobs"));
      const res2 = await getDocs(res);
      const data = res2.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setFilteredJob(data);
    } catch (error) {
      console.log(error.messgae);
      notifyError(`${error.messgae}`);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchDocument();
  }, [fetchDocument]);

  if (isLoading) {
    return (
      <>
        <div className="h-screen flex items-center justify-center">
          <h1 className="text-3xl font-medium">Loading...</h1>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>View job | Find Jobs</title>
        <meta
          name="description"
          content="Find Jobs is online job finding portal. Developed and Designed by Phanindra Reddy."
        />
        <link rel="icon" href="/findjobnavbluewhite.svg" />
      </Head>
      <div className="h-full bg-slate-200 p-2 md:px-20 md:py-10">
        {filteredJob
          ?.filter((job) => job?.id === jobID[0])
          ?.map((job) => (
            <div
              key={job?.id}
              className="bg-white border rounded-md p-4 md:p-10"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-start">
                  <div className="mr-5">
                    {job.company_logo ? (
                      <>
                        <Image
                          src={job?.company_logo}
                          alt={job?.company_name}
                          width={100}
                          height={100}
                        />
                      </>
                    ) : (
                      <>
                        <Image
                          src="/company_fake_logo.webp"
                          alt={job?.company_name}
                          width={100}
                          height={100}
                        />
                      </>
                    )}
                  </div>
                  <div>
                    <h1 className="text-xl md:text-3xl font-medium text-blue-600">
                      {job?.role}
                    </h1>
                    <p>
                      <Link href={`${job?.company_url}`}>
                        <a className="hover:underline">{job?.company_name}</a>
                      </Link>
                    </p>
                  </div>
                </div>
                <div className="hidden md:block flex-col">
                  <p>
                    Created At:{" "}
                    <span className="font-medium">{job?.createdAt}</span>
                  </p>
                  <p>
                    Updated At:{" "}
                    <span className="font-medium">{job?.updatedAt}</span>
                  </p>
                  <p>
                    Posted by:{" "}
                    <Link href={`/user/${job?.posted_by}`}>
                      <a className="text-blue-600 hover:underline hover:font-medium">
                        {job?.posted_by}
                      </a>
                    </Link>
                  </p>
                </div>
              </div>
              <div className="mt-5 my-1">
                <p className="my-1">
                  Location: <span className="font-medium">{job?.location}</span>{" "}
                </p>
                <p className="my-1">
                  Job Type:{" "}
                  <span className="font-medium">
                    {job?.job_type} ({job?.onsite_remote})
                  </span>
                </p>
              </div>
              <div className="flex flex-col md:flex-row md:items-center my-1">
                <p className="mr-5">
                  Exp: <span className="font-medium">{job?.experience}</span>
                </p>
                <p className="">
                  Date Posted:{" "}
                  <span className="font-medium">{job?.date_posted}</span>
                  <small className="text-red-600">
                    (Date mentioned on company site.)
                  </small>
                </p>
              </div>
              <Link href={`${job?.apply_link}`}>
                <a
                  target="_blank"
                  className="w-28 p-2 my-5 text-white flex items-center justify-center font-medium bg-blue-600 hover:bg-blue-800 rounded-3xl"
                >
                  <span className="mr-2">Apply</span>
                  <BiLinkExternal />
                </a>
              </Link>

              <div className="my-5">
                {job?.tags.split(",")?.map((tag, i) => (
                  <button
                    key={i}
                    className="border p-1 rounded-md m-2 hover:bg-blue-400"
                  >{`#${tag}`}</button>
                ))}
              </div>

              <div>
                <h3 className="text-2xl font-medium underline mb-5">
                  Description
                </h3>
                {job?.description
                  ? ReactHtmlParser(job?.description)
                  : "No Description."}
              </div>

              <div className="block md:hidden flex-col mt-10">
                <p>
                  Created At:{" "}
                  <span className="font-medium">{job?.createdAt}</span>
                </p>
                <p>
                  Updated At:{" "}
                  <span className="font-medium">{job?.updatedAt}</span>
                </p>
                <p>
                  Posted by:{" "}
                  <Link href={`/user/${job?.posted_by}`}>
                    <a className="text-blue-600 hover:underline hover:font-medium">
                      {job?.posted_by}
                    </a>
                  </Link>
                </p>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default ViewJobId;
