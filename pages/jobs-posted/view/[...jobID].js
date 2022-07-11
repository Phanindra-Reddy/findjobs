import React, { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuth } from "../../../hooks/AuthContext";
import { firestore } from "../../../utils/firebase";
import {
  collection,
  query,
  getDocs,
  where,
  doc,
  deleteDoc,
} from "firebase/firestore";
import Link from "next/link";
import ReactHtmlParser from "react-html-parser";
import { BiLinkExternal } from "react-icons/bi";
import { notifyError, notifyInfo } from "../../../utils/toasters";

const ViewJobId = () => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const { jobID } = router.query;

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [filteredJob, setFilteredJob] = useState([]);

  const fetchDocument = async () => {
    setIsLoading(true);

    try {
      const q = query(
        collection(firestore, "users"),
        where("uid", "==", currentUser?.uid)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      data.map(async (elem) => {
        const workQ = query(collection(firestore, `users/${elem.id}/jobs`));
        const workDetails = await getDocs(workQ);
        const workInfo = workDetails.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setFilteredJob(workInfo);
      });
    } catch (error) {
      console.log(error.message);
      notifyError(`${error.message}`);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchDocument();
  }, []);

  const deleteJob = async (val) => {
    setIsUpdate(true);

    try {
      const q = query(
        collection(firestore, "users"),
        where("uid", "==", currentUser?.uid)
      );
      const querySnapshot = await getDocs(q);
      let docID = "";
      querySnapshot.forEach((doc) => {
        docID = doc.id;
      });

      const docRef = doc(firestore, `users/${docID}/jobs/${jobID}`);
      await deleteDoc(docRef);
      router.push("/jobs-posted");
      notifyInfo("Job deleted successfully.");
    } catch (error) {
      console.log(error.message);
      notifyError(`${error.message}`);
    }

    setIsUpdate(false);
  };

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
      <div className="min-h-screen bg-slate-200 p-2 md:px-20 md:py-10">
        {filteredJob
          ?.filter((job) => job?.id === jobID[0])
          ?.map((job) => (
            <div
              key={job?.id}
              className="bg-white border rounded-md p-4 md:p-10"
            >
              <div className="flex items-center justify-between">
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
                <div className="hidden md:block flex-col">
                  <p>
                    Created At:{" "}
                    <span className="font-medium">{job?.createdAt}</span>
                  </p>
                  <p>
                    Updated At:{" "}
                    <span className="font-medium">{job?.updatedAt}</span>
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
              <div className="flex items-center my-1">
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
              </div>
            </div>
          ))}

        {filteredJob?.length > 0 && (
          <button
            onClick={() => deleteJob(jobID[0])}
            className="flex items-center bg-red-700 text-white font-medium text-xl px-12 py-2 text-center rounded-md l my-10 hover:bg-red-900"
          >
            {isUpdate ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Deleting job...
              </>
            ) : (
              <>Delete Job</>
            )}
          </button>
        )}
      </div>
    </>
  );
};

export default ViewJobId;
