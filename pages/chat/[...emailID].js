import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment, useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/AuthContext";
import { BsThreeDots } from "react-icons/bs";
import { BiSend } from "react-icons/bi";
import { useRouter } from "next/router";
import {
  collection,
  getDocs,
  updateDoc,
  query,
  where,
  doc,
  setDoc,
  orderBy,
  serverTimestamp,
  querySnapshot,
} from "firebase/firestore";
import { firestore } from "../../utils/firebase";
import { v4 as uuidv4 } from "uuid";
import ChatSideNav from "../../components/ChatSideNav";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Menu, Transition } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const SingleUserChat = () => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const { emailID } = router.query;

  const [isLoading, setIsLoading] = useState(false);
  const [chatUsersList, setChatUsersList] = useState([]);
  const [selectedChatUser, setSelectedChatUser] = useState();
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState("");
  const [blockedUser, setBlockedUser] = useState();

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

      const block_user = query(collection(firestore, `users/${item.id}/chats`));

      const blockedUser = await getDocs(block_user);
      const blockedUserDetails = blockedUser?.docs?.map((doc) => ({
        ...doc.data(),
      }));
      const filterCurrentChatUser = blockedUserDetails?.filter(
        (user) => user?.to?.email == emailID
      );

      setBlockedUser(filterCurrentChatUser[0]?.blockUser);

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
    fetchMessages();
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

    if(msgInput === ""){
      return;
    }

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

  const blockUser = async () => {
    const q = query(
      collection(firestore, "users"),
      where("uid", "==", currentUser?.uid)
    );
    const snapshot = await getDocs(q);
    let docID = "";
    snapshot.forEach((doc) => {
      docID = doc.id;
    });

    const docRef = doc(firestore, `users/${docID}/chats/${emailID}`);
    updateDoc(docRef, {
      blockUser: true,
    });
  };

  const unBlockUser = async () => {
    const q = query(
      collection(firestore, "users"),
      where("uid", "==", currentUser?.uid)
    );
    const snapshot = await getDocs(q);
    let docID = "";
    snapshot.forEach((doc) => {
      docID = doc.id;
    });

    const docRef = doc(firestore, `users/${docID}/chats/${emailID}`);
    updateDoc(docRef, {
      blockUser: false,
    });
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
            <div className="hidden lg:block lg:w-1/4 h-screen sticky top-0 border-r">
              <Scrollbars>
                <Link href="/">
                  <a className="flex items-center justify-center border-b">
                    <svg
                      className="hidden md:block h-12 w-12"
                      viewBox="0 0 1080 1080"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="1080" height="1080" fill="#F5F5F5" />
                      <rect width="1080" height="1080" fill="#1436EA" />
                      <path
                        d="M253 824C227.667 824 208 817 194 803C180.667 789 174 768.667 174 742V191C174 165 181 145 195 131C209 117 229 110 255 110H597C617 110 632 115.333 642 126C652.667 136 658 150.667 658 170C658 190 652.667 205.333 642 216C632 226 617 231 597 231H329V403H575C595 403 610.333 408.333 621 419C631.667 429 637 443.667 637 463C637 482.333 631.667 497.333 621 508C610.333 518.667 595 524 575 524H329V742C329 796.667 303.667 824 253 824ZM687.313 1003C669.312 1003.67 654.979 1000.67 644.312 994C633.646 987.333 626.312 978.667 622.312 968C618.312 958 617.312 947.667 619.312 937C620.646 926.333 624.979 917 632.312 909C639.646 901 649.646 896.333 662.312 895C688.313 893 706.979 885.667 718.313 873C730.313 861 736.313 842.333 736.313 817V392C736.313 367.333 742.979 348.667 756.313 336C769.646 322.667 788.313 316 812.313 316C836.313 316 854.646 322.667 867.313 336C880.646 348.667 887.313 367.333 887.313 392V803C887.313 847 879.979 883.333 865.313 912C851.313 940.667 829.646 962.333 800.313 977C770.979 992.333 733.313 1001 687.313 1003ZM811.313 234C783.979 234 762.646 227.667 747.313 215C732.646 201.667 725.313 183 725.313 159C725.313 134.333 732.646 115.667 747.313 103C762.646 89.6666 783.979 82.9999 811.313 82.9999C839.313 82.9999 860.646 89.6666 875.313 103C889.979 115.667 897.313 134.333 897.313 159C897.313 183 889.979 201.667 875.313 215C860.646 227.667 839.313 234 811.313 234Z"
                        fill="white"
                      />
                    </svg>
                    <h1 className="text-center py-6 ml-5 font-medium text-2xl">
                      Your contacts
                    </h1>
                  </a>
                </Link>
                <ul className="list-none">
                  {chatUsersList?.map((user) => (
                    <li
                      key={user?.id}
                      className={`p-2 px-5 border-b hover:bg-blue-400 cursor-pointer ${
                        emailID == user?.to?.email && "bg-slate-200"
                      }`}
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
                <nav className="border-b p-2 md:p-3 flex items-center justify-between bg-slate-300 z-10 sticky top-16">
                  {selectedChatUser && (
                    <div>
                      <div className="flex">
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
                      </div>
                    </div>
                  )}
                  <Menu as="div" className="ml-3 relative">
                    <div>
                      <Menu.Button className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                        <span className="sr-only">Open user menu</span>

                        <div className="text-2xl w-10 h-10 hover:bg-slate-200 rounded-full flex items-center justify-center">
                          <BsThreeDots />
                        </div>
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-xl py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <div
                              onClick={() =>
                                router.push(
                                  `/user/${
                                    selectedChatUser?.to?.email?.split("@")[0]
                                  }`
                                )
                              }
                              type="button"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-violet-500 hover:text-white"
                              )}
                            >
                              Profile
                            </div>
                          )}
                        </Menu.Item>

                        {/* {blockedUser ? (
                          <>
                            <Menu.Item>
                              {({ active }) => (
                                <div
                                  onClick={unBlockUser}
                                  type="button"
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-violet-500 hover:text-white"
                                  )}
                                >
                                  Unblock
                                </div>
                              )}
                            </Menu.Item>
                          </>
                        ) : (
                          <>
                            <Menu.Item>
                              {({ active }) => (
                                <div
                                  onClick={blockUser}
                                  type="button"
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-violet-500 hover:text-white"
                                  )}
                                >
                                  Block
                                </div>
                              )}
                            </Menu.Item>
                          </>
                        )} */}
                        {/* {({ active }) => (
                            <div
                              onClick={blockUser}
                              type="button"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-violet-500 hover:text-white"
                              )}
                            >
                              Block
                            </div>
                          )} */}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </nav>
                <div className={`p-4 md:mx-5  mb-14 flex flex-col`}>
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

                  {/* {blockedUser ? (
                    <div className="flex flex-col items-center justify-center relative top-28">
                      <h1 className="text-center font-medium text-5xl mb-12">
                        Sorry:)
                      </h1>
                      <h1 className="font-medium text-xl text-center text-red-600">
                        {currentUser?.displayName}({currentUser?.email}) blocked
                        you.
                      </h1>
                    </div>
                  ) : (
                    messages &&
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
                    ))
                  )} */}
                  <div ref={bottomOfChat}></div>
                </div>

                {!blockedUser && (
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleUserChat;
