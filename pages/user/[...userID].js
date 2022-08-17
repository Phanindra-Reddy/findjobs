import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
} from "firebase/firestore";
import { firestore } from "../../utils/firebase";
import { useAuth } from "../../hooks/AuthContext";
import ChatRequestLoginModal from "../../components/ChatRequestLoginModal";
import { v4 as uuidv4 } from "uuid";

const UserProfile = () => {
  const router = useRouter();
  const { userID } = router.query;
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [userFetchError, setUserFetchError] = useState(false);
  const [user, setUser] = useState();
  const [openChatLoginModal, setOpenChatLoginModal] = useState(false);

  const fetchUser = async () => {
    setIsLoading(true);

    try {
      const q = query(
        collection(firestore, "users"),
        where("username", "==", userID[0])
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs[0].data();
      setUser(data);
    } catch (error) {
      if (error) {
        setUserFetchError(true);
      }
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, [userID]);

  const requestForChat = async () => {
    if (!currentUser) {
      setOpenChatLoginModal(!openChatLoginModal);
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(
        "selectedChatUser",
        JSON.stringify({
          to: {
            id: user?.uid,
            email: user?.email,
            name: user?.name,
            photo: user?.photoURL,
          },
          from: {
            id: currentUser?.uid,
            email: currentUser?.email,
            name: currentUser?.displayName,
            photo: currentUser?.photoURL,
          },
          blockUser: false,
          id:user?.email,
        })
      );
    }

    const senderQ = query(
      collection(firestore, "users"),
      where("username", "==", currentUser?.email?.split("@")[0])
    );
    const recieverQ = query(
      collection(firestore, "users"),
      where("username", "==", user?.username)
    );

    const senderDocs = await getDocs(senderQ);
    const recieverDocs = await getDocs(recieverQ);

    let senderChatId = currentUser?.email;
    let recieverChatId = user?.email;

    senderDocs?.docs?.map(async (v) => {
      await setDoc(doc(firestore, `users/${v.id}/chats`, recieverChatId), {
        to: {
          id: user?.uid,
          email: user?.email,
          name: user?.name,
          photo: user?.photoURL,
        },
        from: {
          id: currentUser?.uid,
          email: currentUser?.email,
          name: currentUser?.displayName,
          photo: currentUser?.photoURL,
        },
        blockUser: false,
      });
    });

    recieverDocs?.docs?.map(async (v) => {
      await setDoc(doc(firestore, `users/${v.id}/chats`, senderChatId), {
        to: {
          id: currentUser?.uid,
          email: currentUser?.email,
          name: currentUser?.displayName,
          photo: currentUser?.photoURL,
        },
        from: {
          id: user?.uid,
          email: user?.email,
          name: user?.name,
          photo: user?.photoURL,
        },
        blockUser: false,
      });
    });

    router.push(`/chat/${user?.email}`);
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

  if (userFetchError) {
    return (
      <>
        <div className="h-screen flex items-center justify-center">
          <h1 className="text-3xl md:text-5xl">
            <b className="font-bold font-sans bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
              User not found
            </b>
            <span>🙂</span>
          </h1>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{user?.name} | Find Jobs</title>
        <meta
          name="description"
          content="Find Jobs is online job finding portal. Developed and Designed by Phanindra Reddy."
        />
        <link rel="icon" href="/findjobnavbluewhite.svg" />
      </Head>
      <div>
        <div className="border border-slate-200 rounded flex flex-col items-center justify-center py-5 m-2 mt-10 md:m-10">
          {!(currentUser?.email?.split("@")[0] == userID) && (
            <button
              onClick={requestForChat}
              className="block bg-blue-600 rounded-md text-white font-medium p-2 px-5 hover:bg-blue-800 absolute right-5 top-20 md:right-20 md:top-32"
            >
              Start Chat
            </button>
          )}

          <div className="rounded-full bg-gray-600 text-white text-5xl md:text-9xl flex items-center justify-center">
            {user?.photoURL ? (
              <>
                <img
                  className="rounded-full h-48 w-48"
                  src={user?.photoURL}
                  alt={user?.name}
                />
              </>
            ) : (
              <></>
            )}
          </div>
          <div className="flex items-center mt-10">
            <h2 className="text-2xl md:text-3xl font-bold mr-2 text-center">
              {user && user?.name}
            </h2>
            {user && user?.email && (
              <Image src="/verified.png" alt="profile" width={20} height={20} />
            )}
          </div>
          {user?.showEmail && user?.email && (
            <h5 className="text-lg font-normal">{user && user?.email}</h5>
          )}
          {user && (
            <>
              <div>
                {user?.location && (
                  <p className="flex items-center justify-center text-center">
                    <img
                      className="rounded-full h-5 w-5 mr-2"
                      src="/location.jpg"
                      alt={user?.location}
                    />
                    <span>{user?.location}</span>
                  </p>
                )}
                {user?.bio && (
                  <p className="my-3 mx-auto w-11/12 md:w-4/5 break-words">
                    {user?.bio}
                  </p>
                )}
                {user?.showSocials && (
                  <div className="mt-10 flex items-center justify-around md:justify-center">
                    {user?.website && (
                      <Link href={`${user?.website}`}>
                        <a target="_blank">
                          <img
                            className="h-10 w-10 mr-2"
                            src="/website.png"
                            alt={user?.website}
                          />
                        </a>
                      </Link>
                    )}

                    {user?.linkedinUrl && (
                      <Link href={`${user?.linkedinUrl}`}>
                        <a target="_blank">
                          <img
                            className=" h-10 w-10 mr-2"
                            src="/linkedin.webp"
                            alt={user?.linkedinUrl}
                          />
                        </a>
                      </Link>
                    )}

                    {user?.githubUrl && (
                      <Link href={`${user?.githubUrl}`}>
                        <a target="_blank">
                          <img
                            className="h-10 w-10 mr-2"
                            src="/github.webp"
                            alt={user?.githubUrl}
                          />
                        </a>
                      </Link>
                    )}

                    {user?.twitterUrl && (
                      <Link href={`${user?.twitterUrl}`}>
                        <a target="_blank">
                          <img
                            className="h-10 w-10 mr-2"
                            src="/twitter.png"
                            alt={user?.twitterUrl}
                          />
                        </a>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <ChatRequestLoginModal
        openChatLoginModal={openChatLoginModal}
        setOpenChatLoginModal={setOpenChatLoginModal}
      />
    </>
  );
};

export default UserProfile;
