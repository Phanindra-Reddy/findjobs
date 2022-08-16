import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/AuthContext";
import { BsThreeDots } from "react-icons/bs";
import { BiSend } from "react-icons/bi";
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
import ChatSideNav from "../../components/ChatSideNav";
import { Scrollbars } from "react-custom-scrollbars-2";

const ChatDashboard = () => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const { emailID } = router.query;

  const [isLoading, setIsLoading] = useState(false);
  const [chatUsersList, setChatUsersList] = useState([]);

  const fetchAllCurrentUserChats = async () => {
    //setIsLoading(true);

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
      const jobQ = query(collection(firestore, `users/${item.id}/chats`));
      const jobDetails = await getDocs(jobQ);
      const jobsLists = jobDetails?.docs?.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setChatUsersList(jobsLists);
    });

    //setIsLoading(false);
  };

  useEffect(() => {
    fetchAllCurrentUserChats();

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
        <title>Chat Dashboard | Find Jobs</title>
        <meta
          name="description"
          content="Find Jobs is online job finding portal. Developed and Designed by Phanindra Reddy."
        />
        <link rel="icon" href="/findjobnavbluewhite.svg" />
      </Head>

      <div className="flex flex-col h-screen">
        <div className="flex-1">
          <div className="flex flex-row">
            <div className="w-full lg:w-1/4 h-screen sticky top-0">
              <Scrollbars>
                <ChatSideNav chatUsersList={chatUsersList} />
              </Scrollbars>
            </div>
            <div className="w-full hidden lg:block lg:w-3/4">
              <div className="flex flex-col items-center justify-center border-l">
                <div className="mt-32">
                  <Image src="/chat.png" alt="chat" width={400} height={200} />
                </div>
                <h1 className="text-2xl font-medium text-center mt-5">
                  Welcome to find jobs chat
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatDashboard;