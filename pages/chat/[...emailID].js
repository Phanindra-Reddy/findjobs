import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
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
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { firestore } from "../../utils/firebase";
import { v4 as uuidv4 } from "uuid";
import ChatSideNav from "../../components/ChatSideNav";
import { Scrollbars } from "react-custom-scrollbars-2";

const SingleUserChat = () => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const { emailID } = router.query;

  const [isLoading, setIsLoading] = useState(false);
  const [chatUsersList, setChatUsersList] = useState([]);
  const [selectedChatUser, setSelectedChatUser] = useState();
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState("");

  const bottomOfChat = useRef();

  const fetchAllCurrentUserChats = async () => {
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
      const jobQ = query(collection(firestore, `users/${item.id}/chats`));
      const jobDetails = await getDocs(jobQ);
      const jobsLists = jobDetails?.docs?.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setChatUsersList(jobsLists);
    });

    setIsLoading(false);
  };

  const fetchMessages = async () => {
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
      const chatQ = query(
        collection(firestore, `users/${item.id}/chats/${emailID}/messages`),
        orderBy("timestamp")
      );
      const ChatDetails = await getDocs(chatQ);
      const allChatMessages = ChatDetails?.docs?.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMessages(allChatMessages);
    });
  };

  useEffect(() => {
    fetchAllCurrentUserChats();

    if (!currentUser) {
      router.push("/login");
      return;
    }
  }, []);

  useEffect(() => {
    fetchMessages();
    if (typeof window !== "undefined") {
      let selectedchatuser = JSON.parse(
        localStorage.getItem("selectedChatUser")
      );
      setSelectedChatUser(selectedchatuser);
    }
  }, [emailID]);

  useEffect(() => {
    fetchMessages()
    setTimeout(
      bottomOfChat.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      }),
      100
    );
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();

    const senderQ = query(
      collection(firestore, "users"),
      where("username", "==", currentUser?.email?.split("@")[0])
    );
    const recieverQ = query(
      collection(firestore, "users"),
      where("username", "==", selectedChatUser?.to?.email?.split("@")[0])
    );

    const senderDocs = await getDocs(senderQ);
    const recieverDocs = await getDocs(recieverQ);
    let msgID = uuidv4();

    senderDocs?.docs?.map(async (v) => {
      await setDoc(
        doc(firestore, `users/${v.id}/chats/${emailID}/messages`, msgID),
        {
          text: msgInput,
          sender: currentUser?.email,
          reciever: selectedChatUser?.to?.email,
          timestamp: serverTimestamp(),
        }
      );
    });

    recieverDocs?.docs?.map(async (v) => {
      await setDoc(
        doc(
          firestore,
          `users/${v.id}/chats/${selectedChatUser?.from?.email}/messages`,
          msgID
        ),
        {
          text: msgInput,
          sender: selectedChatUser?.from?.email,
          reciever: selectedChatUser?.to?.email,
          timestamp: serverTimestamp(),
        }
      );
    });
    //fetchMessages();
    setMsgInput("");
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
            <div className="hidden lg:block lg:w-1/4 h-screen sticky top-0">
              <Scrollbars>
                <h1 className="border-b text-center py-6 font-medium text-2xl">
                  Your contacts
                </h1>
                <ul className="list-none">
                  {chatUsersList?.map((user) => (
                    <li
                      key={user?.id}
                      className={`p-2 px-5 border-b hover:bg-gray-200 cursor-pointer ${emailID === user?.to?.email && "bg-slate-200" }`}
                      onClick={() => {
                        if (typeof window !== "undefined") {
                          localStorage.setItem(
                            "selectedChatUser",
                            JSON.stringify(user)
                          );
                        }
                        router.push(`${user?.to?.email}`);
                      }}
                    >
                      <div className="flex">
                        <Image
                          src={user?.to?.photo}
                          alt="user"
                          height={40}
                          width={40}
                          className="rounded-full"
                        />
                        <p className="font-medium text-base ml-2">
                          {user?.to?.name}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Scrollbars>
            </div>
            <div className="w-full lg:w-3/4">
              <div className="border-l">
                <nav className="border-b p-2 md:p-3 flex items-center justify-between bg-slate-300 z-10 sticky top-0">
                  {selectedChatUser && (
                    <Link href="#">
                      <a className="flex">
                        <Image
                          src={selectedChatUser?.to?.photo}
                          alt="user"
                          height={40}
                          width={40}
                          className="rounded-full"
                        />
                        <p className="font-medium text-lg ml-2">
                          {selectedChatUser?.to?.name}
                        </p>
                      </a>
                    </Link>
                  )}
                  <button className="text-2xl w-10 h-10 hover:bg-slate-200 rounded-full flex items-center justify-center">
                    <BsThreeDots />
                  </button>
                </nav>
                <div className={`p-4 md:mx-5 md:mt-16 mb-14 flex flex-col`}>
                  {messages &&
                    messages?.map((msg) => (
                      <p
                        key={msg?.id}
                        className={`p-3 m-1 min-w-[20%] w-fit rounded-md ${
                          msg?.sender === currentUser?.email
                            ? "bg-green-200 self-end"
                            : "bg-blue-200 self-start"
                        }`}
                      >
                        {msg?.text}
                      </p>
                    ))}
                  <div ref={bottomOfChat}></div>
                </div>

                <div className="bg-gray-200 p-3 w-full lg:w-3/4 fixed bottom-0">
                  <form className="flex" onSubmit={sendMessage}>
                    <input
                      type="text"
                      placeholder="Type message..."
                      className="focus:ring-indigo-500 focus:border-indigo-500 hover:border-slate-700 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={msgInput}
                      onChange={(e) => setMsgInput(e.target.value)}
                      autoComplete="off"
                    />
                    <button
                      type="submit"
                      className="flex items-center ml-5 text-lg bg-blue-600 hover:bg-blue-800 text-white rounded px-2 py-1"
                    >
                      <BiSend />
                      <p className="ml-2 font-medium">Send</p>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleUserChat;
