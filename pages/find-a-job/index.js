import React, { useState, useEffect, useMemo } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { notifyError, notifySuccess } from "../../utils/toasters";
import { useRouter } from "next/router";
import { useAuth } from "../../hooks/AuthContext";
import { firestore } from "../../utils/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDoc,
  getDocs,
  updateDoc,
  doc,
  setDoc,
  collectionGroup,
} from "firebase/firestore";
import moment from "moment";
import { BsFillEyeFill } from "react-icons/bs";
import SearchAJob from "../../components/SearchAJob";
import Pagination from "../../components/Pagination";

const PageSize = 10;

const FindAJob = () => {
  const router = useRouter();
  const { currentUser } = useAuth();

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const firstPageIndex = (currentPage - 1) * PageSize;
  const lastPageIndex = firstPageIndex + PageSize;

  //fetching & searching for jobs
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    role: "",
    company: "",
    location: "",
  });
  const [allJobs, setAllJobs] = useState([]);

  const fetchJobsPosted = async () => {
    setIsLoading(true);

    try {
      const res = query(collectionGroup(firestore, "jobs"));
      const res2 = await getDocs(res);
      const data = res2.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setAllJobs(data);
    } catch (error) {
      console.log(error.messgae);
      notifyError(`${error.messgae}`);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchJobsPosted();
  }, []);

  if (isLoading) {
    return (
      <>
        <div className="h-screen flex items-center justify-center">
          <h1 className="text-3xl font-medium">Loading...</h1>
        </div>
      </>
    );
  }

  console.log(allJobs);

  return (
    <>
      <Head>
        <title>Find a job | Find Jobs</title>
        <meta
          name="description"
          content="Find Jobs is online job finding portal. Developed and Designed by Phanindra Reddy."
        />
        <link rel="icon" href="/findjobnavbluewhite.svg" />
      </Head>
      <div className="min-h-screen bg-gray-200">
        <div className="py-10 md:sticky -top-10">
          <SearchAJob
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
        </div>
        <div className=" pb-10 px-2 md:px-48">
          <div className=" bg-white border border-gray-300 rounded-md mx-1">
            {allJobs &&
              allJobs?.slice(firstPageIndex, lastPageIndex)?.map((job) => (
                <div
                  key={job?.id}
                  className="md:h-54 group cursor-pointer my-3 px-6 md:px-10 pb-4 flex flex-col border-b"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center">
                        <div className="mr-5">
                          {job.company_logo ? (
                            <>
                              <Image
                                src={job?.company_logo}
                                alt={job?.company_name}
                                width={128}
                                height={128}
                                layout="intrinsic"
                                quality={80}
                              />
                            </>
                          ) : (
                            <>
                              <Image
                                src="/company_fake_logo.webp"
                                alt={job?.company_name}
                                width={128}
                                height={128}
                              />
                            </>
                          )}
                        </div>
                        <div>
                          <h2
                            onClick={() =>
                              router.push(`find-a-job/view/${job?.id}`)
                            }
                            className="text-xl text-blue-600 font-medium group-hover:underline"
                          >
                            {job?.role}
                          </h2>
                          <p className="font-medium hover:underline">
                            <Link href={`${job?.company_url}`}>
                              <a target="_blank">{job?.company_name}</a>
                            </Link>
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-500">
                        {job?.location && job?.location} {""} (
                        {job?.job_type && job?.job_type})
                      </p>
                      <p className="text-gray-500">
                        {job?.experience && job?.experience} {""} (
                        {job?.onsite_remote && job?.onsite_remote})
                      </p>
                    </div>

                    <button
                      onClick={() => router.push(`find-a-job/view/${job?.id}`)}
                      className="hidden group-hover:block"
                    >
                      <BsFillEyeFill className="h-6 w-6 mr-10" />
                    </button>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <p className="text-green-700 font-semibold">
                      {job?.date_posted &&
                        `Job Posted on: ` +
                          moment(`${job?.date_posted}`).format("MM-DD-YYYY")}
                      <small className="font-normal text-black">
                        (On Company site)
                      </small>
                    </p>

                    {job?.posted_by && (
                      <>
                        <div className="flex items-center my-2 md:m-0">
                          <p className="mr-2">Posted by: </p>
                          <Link href={`/user/${job?.posted_by}`}>
                            <a className="text-blue-600 hover:underline hover:font-medium">
                              {job?.posted_by}
                            </a>
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                  <p className="text-sm">
                    {job?.createdAt === job?.updatedAt
                      ? "Created At: " + `${job?.createdAt}`
                      : "Updated At: " + `${job?.updatedAt}`}
                  </p>
                </div>
              ))}
          </div>
        </div>
        <div className="flex items-end justify-center pb-10">
          <Pagination
            className="pagination-bar"
            currentPage={currentPage}
            totalCount={allJobs.length}
            pageSize={PageSize}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </>
  );
};

export default FindAJob;
