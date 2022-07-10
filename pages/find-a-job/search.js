import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { notifyError } from "../../utils/toasters";
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
import SearchAJob from "../../components/SearchAJob";
import Link from "next/link";
import { BsFillEyeFill } from "react-icons/bs";
import moment from "moment";

const JobSearch = () => {
  const router = useRouter();
  const { role, company, location } = router.query;
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    role: role,
    company: company,
    location: location,
  });
  const [allJobs, setAllJobs] = useState([]);

  const fetchJobsPosted = async () => {
    setIsLoading(true);

    try {
      const museums = query(collectionGroup(firestore, "jobs"));
      const querySnapshot = await getDocs(museums);
      const alljobsRef = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      const filteredJobs = alljobsRef?.filter((job) => {
        return (
          job?.role?.toLowerCase().indexOf(role?.toLowerCase()) > -1 &&
          job?.company_name?.toLowerCase().indexOf(company?.toLowerCase()) >
            -1 &&
          job?.location?.toLowerCase().indexOf(location?.toLowerCase()) > -1
        );
      });

      setAllJobs(filteredJobs);
    } catch (error) {
      console.log(error.messgae);
      notifyError(`${error.messgae}`);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchJobsPosted();
  }, [role, company, location]);

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
      <div className="min-h-screen bg-gray-200">
        <div className="py-10 md:sticky md:top-10">
          <SearchAJob
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
        </div>
        <div className=" pb-10 px-2 md:px-48">
          <div className=" bg-white border border-gray-300 rounded-md mx-1">
            {allJobs &&
              allJobs?.map((job) => (
                <div
                  key={job?.id}
                  className="md:h-40 group cursor-pointer my-3 px-6 md:px-10 pb-4 flex flex-col border-b"
                >
                  <div className="flex items-start justify-between mb-4">
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
                      onClick={() => router.push(`view/${job?.id}`)}
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
      </div>
    </>
  );
};

export default JobSearch;
