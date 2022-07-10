import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";
import { useAuth } from "../hooks/AuthContext";
import Link from "next/link";
import { notifyError } from "../utils/toasters";
import { firestore } from "../utils/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDoc,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

const YourPofile = () => {
  const router = useRouter();
  const { currentUser } = useAuth();

  const [userDetails, setUserDetails] = useState(null);

  const fetchUserDetails = async () => {
    try {
      const q = query(
        collection(firestore, "users"),
        where("uid", "==", currentUser?.uid)
      );
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setUserDetails({
        ...userDetails,
        name: data?.name,
        email: data?.email,
        photoURL: data?.photoURL,
        username: data?.username,
        website: data?.website,
        location: data?.location,
        bio: data?.bio,
        linkedinUrl: data?.linkedinUrl,
        githubUrl: data?.githubUrl,
        twitterUrl: data?.twitterUrl,
        showEmail: data?.showEmail,
        showSocials: data?.showSocials,
        showProfile: data?.showProfile,
      });
    } catch (error) {
      console.error(error.message);
      notifyError("An error occured while fetching user data");
    }
  };

  useEffect(() => {
    if (!currentUser) {
      return router.push("/login");
    }

    fetchUserDetails();
  }, [currentUser]);

  return (
    <>
      <Head>
        <title>Pofile | Find Jobs</title>
        <meta
          name="description"
          content="Find Jobs is online job finding portal. Developed and Designed by Phanindra Reddy."
        />
        <link rel="icon" href="/findjobnavbluewhite.svg" />
      </Head>
      <div className="">
        <button
          onClick={() => router.push("/settings")}
          className="hidden md:block bg-blue-600 rounded-md text-white font-medium p-2 px-5 hover:bg-blue-800 absolute md:right-20 md:top-32"
        >
          Edit Profile
        </button>
        <div className="border border-slate-200 rounded flex flex-col items-center justify-center py-5 m-2 mt-10 md:m-10">
          <div className="rounded-full bg-gray-600 text-white text-5xl md:text-9xl flex items-center justify-center">
            {currentUser?.photoURL ? (
              <>
                <img
                  className="rounded-full h-48 w-48"
                  src={currentUser?.photoURL}
                  alt={currentUser?.name}
                />
              </>
            ) : (
              <></>
            )}
          </div>
          <div className="flex items-center mt-10">
            <h2 className="text-2xl md:text-3xl font-bold mr-2 text-center">
              {currentUser && currentUser?.displayName}
            </h2>
            {currentUser && currentUser?.emailVerified && (
              <Image src="/verified.png" alt="profile" width={20} height={20} />
            )}
          </div>
          <h5 className="text-lg font-normal">
            {currentUser && currentUser?.email}
          </h5>
          {userDetails && (
            <>
              <div>
                {userDetails?.location && (
                  <p className="flex items-center justify-center text-center">
                    <img
                      className="rounded-full h-5 w-5 mr-2"
                      src="/location.jpg"
                      alt={userDetails?.location}
                    />
                    <span>{userDetails?.location}</span>
                  </p>
                )}
                {userDetails?.bio && (
                  <p className="my-3 mx-auto w-11/12 md:w-4/5 break-words">
                    {userDetails?.bio}
                  </p>
                )}
                <div className="mt-10 flex items-center justify-around md:justify-center">
                  {userDetails?.website && (
                    <Link href={`${userDetails?.website}`}>
                      <a target="_blank">
                        <img
                          className="h-10 w-10 mr-2"
                          src="/website.png"
                          alt={userDetails?.website}
                        />
                      </a>
                    </Link>
                  )}

                  {userDetails?.linkedinUrl && (
                    <Link href={`${userDetails?.linkedinUrl}`}>
                      <a target="_blank">
                        <img
                          className=" h-10 w-10 mr-2"
                          src="/linkedin.webp"
                          alt={userDetails?.linkedinUrl}
                        />
                      </a>
                    </Link>
                  )}

                  {userDetails?.githubUrl && (
                    <Link href={`${userDetails?.githubUrl}`}>
                      <a target="_blank">
                        <img
                          className="h-10 w-10 mr-2"
                          src="/github.webp"
                          alt={userDetails?.githubUrl}
                        />
                      </a>
                    </Link>
                  )}

                  {userDetails?.twitterUrl && (
                    <Link href={`${userDetails?.twitterUrl}`}>
                      <a target="_blank">
                        <img
                          className="h-10 w-10 mr-2"
                          src="/twitter.png"
                          alt={userDetails?.twitterUrl}
                        />
                      </a>
                    </Link>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        <button
          onClick={() => router.push("/settings")}
          className="block md:hidden bg-blue-600 rounded-md text-white font-medium p-2 px-5 mt-16 mb-10 mx-auto hover:bg-blue-800"
        >
          Edit Profile
        </button>
      </div>
    </>
  );
};

export default YourPofile;
