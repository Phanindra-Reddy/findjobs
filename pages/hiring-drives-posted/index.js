import React, { useState, useEffect } from "react";
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
} from "firebase/firestore";
import moment from "moment";
import { BsFillEyeFill } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import Login from "../login";

const HiringDrivesPosted = () => {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [postedDrives, setPostedDrives] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchJobsPosted = async () => {
    setIsLoading(true);

    const q = query(
      collection(firestore, "users"),
      where("uid", "==", currentUser?.uid)
    );
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    data?.map(async (item) => {
      const jobQ = query(collection(firestore, `users/${item.id}/drives`));
      const jobDetails = await getDocs(jobQ);
      const jobsLists = jobDetails?.docs?.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setPostedDrives(jobsLists);
    });

    setIsLoading(false);
  };

  useEffect(() => {
    fetchJobsPosted();

    if (!currentUser) {
      router.push("/login");
      return;
    }
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
      <Head>
        <title>Hiring Drives Posted | Find Jobs</title>
        <meta
          name="description"
          content="Find Jobs is online job finding portal. Developed and Designed by Phanindra Reddy."
        />
        <link rel="icon" href="/findjobnavbluewhite.svg" />
      </Head>
      <div>
        {postedDrives?.length > 0 && (
          <>
            <div className="min-h-screen bg-gray-200 py-10 px-2 md:px-48">
              {postedDrives?.length > 0 && (
                <h1 className="mb-5 text-xl md:text-3xl font-medium">
                  Total hiring drives Posted: {postedDrives?.length}
                </h1>
              )}

              {postedDrives &&
                postedDrives?.map((drive) => (
                  <div
                    key={drive?.id}
                    className="group bg-white border border-gray-300 rounded-sm mb-5 p-5"
                  >
                    <Link href={`hiring-drives-posted/view/${drive?.id}`}>
                      <a>
                        <div className="flex items-center justify-between">
                          <h1 className="text-2xl font-medium text-blue-700 hover:underline">
                            {drive?.title}
                          </h1>
                          <div className="hidden md:flex items-center">
                            <button
                              onClick={() =>
                                router.push(
                                  `hiring-drives-posted/view/${drive?.id}`
                                )
                              }
                              className="hidden group-hover:block"
                            >
                              <BsFillEyeFill className="h-6 w-6 mr-16" />
                            </button>
                            <button
                              onClick={() =>
                                router.push(
                                  `hiring-drives-posted/edit/${drive?.id}`
                                )
                              }
                              className="hidden group-hover:block"
                            >
                              <FaEdit className="h-6 w-6" />
                            </button>
                          </div>
                        </div>
                      </a>
                    </Link>
                    <p>{drive?.date_posted}</p>
                    <div className="flex md:hidden items-center justify-between mt-5">
                      <button
                        onClick={() =>
                          router.push(`hiring-drives-posted/view/${drive?.id}`)
                        }
                        className="flex items-center"
                      >
                        <BsFillEyeFill className="mr-2" />{" "}
                        <span className="font-medium">View</span>
                      </button>
                      <button
                        onClick={() =>
                          router.push(`hiring-drives-posted/edit/${drive?.id}`)
                        }
                        className="flex items-center"
                      >
                        <FaEdit className="mr-2" />{" "}
                        <span className="font-medium">Edit</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}

        {postedDrives?.length <= 0 && (
          <>
            <div className="min-h-screen flex flex-col items-center justify-center">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <h1 className="text-center text-3xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 mb-10">
                  No Hiring Drives Found
                </h1>
              </div>
              <button
                onClick={() => router.push("/post-a-hiring-drive")}
                className="h-14 rounded-md text-xl font-medium mt-8 px-10 border-2 border-violet-500 text-white bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-fuchsia-500 hover:to-violet-500"
              >
                Post a hiring drive
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default HiringDrivesPosted;
