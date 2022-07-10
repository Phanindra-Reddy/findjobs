import React, { useState, useEffect } from "react";
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
} from "firebase/firestore";
import moment from "moment";
import { BsFillEyeFill } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";

const JobsPosted = () => {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [postedJobs, setPostedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchJobsPosted = async () => {
    setIsLoading(true);

    const q = query(collection(firestore, "users"),where("uid","==",currentUser?.uid));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    data?.map(async (item) => {
      const jobQ = query(collection(firestore, `users/${item.id}/jobs`));
      const jobDetails = await getDocs(jobQ);
      const jobsLists = jobDetails?.docs?.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setPostedJobs(jobsLists);
    });

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

  return (
    <>
      <div>
        {postedJobs?.length > 0 && (
          <>
            <div className="min-h-screen bg-gray-200 py-10 px-2 md:px-48">
              <div className=" bg-white border border-gray-300 rounded-md mx-1">
                {postedJobs &&
                  postedJobs?.map((job) => (
                    <div
                      key={job?.id}
                      className="md:h-40 group cursor-pointer my-3 px-6 md:px-10 pb-4 flex flex-col border-b"
                    >
                      <div className="flex items-start md:items-center justify-between mb-4">
                        <div>
                          <h2
                            onClick={() =>
                              router.push(`jobs-posted/view/${job?.id}`)
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
                        <div className="flex items-center">
                          <button
                            onClick={() =>
                              router.push(`jobs-posted/view/${job?.id}`)
                            }
                            className="hidden group-hover:block"
                          >
                            <BsFillEyeFill className="h-6 w-6 mr-10" />
                          </button>
                          <button
                            onClick={() =>
                              router.push(`jobs-posted/edit/${job?.id}`)
                            }
                            className="hidden group-hover:block"
                          >
                            <FaEdit className="h-6 w-6" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <p className="text-green-700 font-semibold">
                          {job?.date_posted &&
                            `Job Posted on: ` +
                            `${job?.date_posted}`}
                          <small className="font-normal text-black">
                            (On Company site)
                          </small>
                        </p>

                        <p className="text-sm">
                          {job?.createdAt === job?.updatedAt
                            ? "Created At: " + `${job?.createdAt}`
                            : "Updated At: " + `${job?.updatedAt}`}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}

        {postedJobs?.length <= 0 && (
          <>
            <div className="min-h-screen flex flex-col items-center justify-center">
              <Image
                src="/no-jobs-found.png"
                alt="home"
                width={400}
                height={400}
              />
              <button
                onClick={() => router.push("post-a-job")}
                className="h-14 rounded-md text-xl font-medium mt-8 px-10 border-2 border-violet-500 text-white bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-fuchsia-500 hover:to-violet-500"
              >
                Post a job
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default JobsPosted;
