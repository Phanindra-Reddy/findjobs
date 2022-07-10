import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "../hooks/AuthContext";
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
import { notifyError, notifySuccess } from "../utils/toasters";

const Settings = () => {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [navActive, setNavActive] = useState("profile");
  const [update, setIsUpdate] = useState(false);

  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    photoURL: "",
    username: "",
    website: "",
    location: "",
    bio: "",
    linkedinUrl: "",
    githubUrl: "",
    twitterUrl: "",
    showEmail: true,
    showSocials: true,
    showProfile: true,
  });

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
      router.push("/login");
      return;
    }

    fetchUserDetails();
  }, [currentUser]);

  const updateProfile = async (e) => {
    e.preventDefault();
    setIsUpdate(true);

    const q = query(
      collection(firestore, "users"),
      where("uid", "==", currentUser?.uid)
    );

    const querySnapshot = await getDocs(q);
    let docID = "";
    querySnapshot.forEach((doc) => {
      docID = doc.id;
    });

    const user = doc(firestore, "users", docID);

    await updateDoc(user, {
      uid: currentUser?.uid,
      name: userDetails?.name,
      email: userDetails?.email,
      photoURL: userDetails?.photoURL,
      username: userDetails?.email?.split("@")[0],
      website: userDetails?.website,
      location: userDetails?.location,
      bio: userDetails?.bio,
      linkedinUrl: userDetails?.linkedinUrl,
      githubUrl: userDetails?.githubUrl,
      twitterUrl: userDetails?.twitterUrl,
      showEmail: true,
      showSocials: true,
      showProfile: true,
    });

    notifySuccess("Profile updated successfully.");
    router.push("/profile");
    fetchUserDetails();
    setIsUpdate(false);
  };

  const updateAccount = async (e) => {
    e.preventDefault();
    setIsUpdate(true);

    const q = query(
      collection(firestore, "users"),
      where("uid", "==", currentUser?.uid)
    );

    const querySnapshot = await getDocs(q);
    let docID = "";
    querySnapshot.forEach((doc) => {
      docID = doc.id;
    });

    const user = doc(firestore, "users", docID);

    await updateDoc(user, {
      uid: currentUser?.uid,
      name: userDetails?.name,
      email: userDetails?.email,
      photoURL: userDetails?.photoURL,
      username: userDetails?.email?.split("@")[0],
      website: userDetails?.website,
      location: userDetails?.location,
      bio: userDetails?.bio,
      linkedinUrl: userDetails?.linkedinUrl,
      githubUrl: userDetails?.githubUrl,
      twitterUrl: userDetails?.twitterUrl,
      showEmail: userDetails?.showEmail,
      showSocials: userDetails?.showSocials,
      showProfile: userDetails?.showProfile,
    });

    notifySuccess("Account updated successfully.");
    router.push("/profile");
    fetchUserDetails();
    setIsUpdate(false);
  };

  return (
    <>
      <Head>
        <title>Settings | Find Jobs</title>
        <meta
          name="description"
          content="Find Jobs is online job finding portal. Developed and Designed by Phanindra Reddy."
        />
        <link rel="icon" href="/findjobnavbluewhite.svg" />
      </Head>
      <div className="h-full bg-gray-200 py-10 px-2 md:px-44">
        <h1 className="font-bold text-3xl mb-10">
          Settings {userDetails?.name && "for "}
          <Link href="/profile">
            <a>
              <span className="text-blue-600">
                {userDetails && userDetails?.name}
              </span>
            </a>
          </Link>
        </h1>

        <div className="flex flex-col md:flex-row md:m-0">
          <div className="hidden md:block md:basis-2/5 mr-5">
            <div className="flex flex-col place-items-start">
              <button
                onClick={() => setNavActive("profile")}
                className={`w-full my-1 p-2 hover:bg-blue-200 rounded-md ${
                  navActive === "profile" && "bg-white font-medium"
                }`}
              >
                😊 Profile
              </button>
              <button
                onClick={() => setNavActive("account")}
                className={`w-full my-1 p-2 hover:bg-blue-200 rounded-md ${
                  navActive === "account" && "bg-white font-medium"
                }`}
              >
                🌏 Account
              </button>
            </div>
          </div>

          <div className="flex md:hidden mb-5 items-center justify-center">
            <select
              className="rounded w-2/3"
              value={navActive}
              onChange={(e) => setNavActive(e.target.value)}
            >
              <option value="profile">Profile</option>
              <option value="account">Account</option>
            </select>
          </div>

          <div className="flex-1 md:basis-4/5">
            {navActive === "profile" && (
              <>
                <form onSubmit={updateProfile}>
                  <div className="bg-white border rounded-lg border-gray-300 w-full p-5 mb-10">
                    <h2 className="font-bold text-xl mt-2 mb-5">User</h2>

                    <div className="flex flex-col items-start mb-5">
                      <label htmlFor="name" className="font-medium">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Phanindra Reddy"
                        className="w-full rounded-md"
                        value={userDetails?.name}
                        onChange={(e) =>
                          setUserDetails({
                            ...userDetails,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="flex flex-col items-start mb-5">
                      <label htmlFor="email" className="font-medium">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="myemailid@gmail.com"
                        className="w-full rounded-md"
                        disabled
                        value={userDetails?.email}
                        // onChange={(e)=>setUserDetails({
                        //   ...userDetails,
                        //   email:e.target.value
                        // })}
                      />
                      <small className="text-xs text-red-700 font-medium">
                        Email can not be changed
                      </small>
                    </div>

                    <div className="flex flex-col items-start">
                      <label htmlFor="username" className="font-medium">
                        Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="phanindra"
                        className="w-full rounded-md"
                        disabled
                        value={userDetails?.email?.split("@")[0]}
                        // onChange={(e)=>setUserDetails({
                        //   ...userDetails,
                        //   username:e.target.value
                        // })}
                      />
                      <small className="text-xs text-red-700 font-medium">
                        Username is given by us based on your email.(can not be
                        changed)
                      </small>
                    </div>

                    <div className="flex flex-col items-start"></div>
                  </div>

                  <div className="bg-white border rounded-lg border-gray-300 w-full p-5 mb-10">
                    <h2 className="font-bold text-xl mt-2 mb-5">Basic</h2>

                    <div className="flex flex-col items-start mb-5">
                      <label htmlFor="website" className="font-medium">
                        Website URL
                      </label>
                      <input
                        type="text"
                        id="website"
                        name="website"
                        placeholder="https://phanindra.vercel.app"
                        className="w-full rounded-md"
                        value={userDetails?.website}
                        onChange={(e) =>
                          setUserDetails({
                            ...userDetails,
                            website: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="flex flex-col items-start mb-5">
                      <label htmlFor="location" className="font-medium">
                        Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        placeholder="Hyderabad, Telangana."
                        className="w-full rounded-md"
                        value={userDetails?.location}
                        onChange={(e) =>
                          setUserDetails({
                            ...userDetails,
                            location: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="flex flex-col items-start">
                      <label htmlFor="bio" className="font-medium">
                        Bio
                      </label>
                      <textarea
                        type="text"
                        id="bio"
                        name="bio"
                        placeholder="A short bio..."
                        rows="4"
                        className="block w-full rounded-md"
                        value={userDetails?.bio}
                        onChange={(e) =>
                          setUserDetails({
                            ...userDetails,
                            bio: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="bg-white border rounded-lg border-gray-300 w-full p-5 mb-10">
                    <h2 className="font-bold text-xl mt-2 mb-5">Socials</h2>

                    <div className="flex flex-col items-start mb-5">
                      <label htmlFor="linkedin" className="font-medium">
                        Linkedin
                      </label>
                      <input
                        type="text"
                        id="linkedin"
                        name="linkedinUrl"
                        placeholder="https://www.linkedin.com/in/phanindra-reddy-maram-747973145/"
                        className="w-full rounded-md"
                        value={userDetails?.linkedinUrl}
                        onChange={(e) =>
                          setUserDetails({
                            ...userDetails,
                            linkedinUrl: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="flex flex-col items-start mb-5">
                      <label htmlFor="github" className="font-medium">
                        Github
                      </label>
                      <input
                        type="text"
                        id="github"
                        name="githubUrl"
                        placeholder="github.com/Phanindra-Reddy"
                        className="w-full rounded-md"
                        value={userDetails?.githubUrl}
                        onChange={(e) =>
                          setUserDetails({
                            ...userDetails,
                            githubUrl: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="flex flex-col items-start">
                      <label htmlFor="twitter" className="font-medium">
                        Twitter
                      </label>
                      <input
                        type="text"
                        id="twitter"
                        name="twitterUrl"
                        placeholder="twitter.com/yoursid"
                        className="w-full rounded-md"
                        value={userDetails?.twitterUrl}
                        onChange={(e) =>
                          setUserDetails({
                            ...userDetails,
                            twitterUrl: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="flex flex-col items-start"></div>
                  </div>

                  <div className="bg-white border rounded-lg border-gray-300 w-full p-5 mb-10 sticky bottom-0">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center text-center text-white rounded-md font-medium bg-blue-600 px-auto py-2 hover:bg-blue-800"
                    >
                      {update ? (
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
                          Updating profile...
                        </>
                      ) : (
                        <>Save Profile Information</>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
            {navActive === "account" && (
              <>
                <div>
                  <form onSubmit={updateAccount}>
                    <div className="bg-white border rounded-lg border-gray-300 w-full p-5 mb-10">
                      <h3 className="font-bold text-2xl mt-2 mb-5">
                        Notification
                      </h3>
                      <div className="flex items-baseline md:items-center my-1">
                        <input
                          type="checkbox"
                          id="showemail"
                          className="mr-3 rounded"
                          checked={userDetails?.showEmail}
                          value={userDetails?.showEmail}
                          onChange={() =>
                            setUserDetails({
                              ...userDetails,
                              showEmail: !userDetails?.showEmail,
                            })
                          }
                        />
                        <label htmlFor="showemail" className="font-medium">
                          Show email on your profile for users to conatct for
                          job details.
                        </label>
                      </div>

                      <div className="flex items-baseline md:items-center my-1">
                        <input
                          type="checkbox"
                          id="socials"
                          className="mr-3 rounded"
                          checked={userDetails?.showSocials}
                          value={userDetails?.showSocials}
                          onChange={() =>
                            setUserDetails({
                              ...userDetails,
                              showSocials: !userDetails?.showSocials,
                            })
                          }
                        />
                        <label htmlFor="socials" className="font-medium">
                          Show socials links on profile.
                        </label>
                      </div>
                      <div className="flex items-baseline md:items-center my-1">
                        <input
                          type="checkbox"
                          id="profile"
                          className="mr-3 rounded"
                          checked={userDetails?.showProfile}
                          value={userDetails?.showProfile}
                          onChange={() =>
                            setUserDetails({
                              ...userDetails,
                              showProfile: !userDetails?.showProfile,
                            })
                          }
                        />
                        <label htmlFor="profile" className="font-medium">
                          Show my profile publicly available.
                        </label>
                      </div>

                      <button className="w-full flex items-center justify-center text-center text-white rounded-md font-medium bg-blue-600 px-auto py-2 hover:bg-blue-800 mt-10">
                        {update ? (
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
                            Updating account...
                          </>
                        ) : (
                          <>Save Account Information</>
                        )}
                      </button>
                    </div>
                  </form>
                  <div className="bg-white border-2 rounded-lg border-red-600 w-full p-5 mb-10">
                    <h2 className="font-bold text-red-600 text-2xl mt-2 mb-5">
                      Danger Zone
                    </h2>

                    <div className="flex flex-col items-start mb-5">
                      <h3 className="font-bold text-xl">
                        Delete all jobs posted
                      </h3>
                      <p className="my-2">Deleting jobs posted will:</p>
                      <ul className="list-disc ml-10 mb-5">
                        <li>
                          Delete all jobs you posted on this website and they
                          will permanently deleted from our database.
                        </li>
                      </ul>
                      <button className="bg-red-500 text-white rounded-md font-medium text-lg p-2 hover:bg-red-600">
                        Delete All Jobs
                      </button>
                    </div>

                    <div className="flex flex-col items-start mb-5">
                      <h3 className="font-bold text-xl">Delete account</h3>
                      <p className="my-2">Deleting your account will:</p>
                      <ul className="list-disc ml-10 mb-5">
                        <li>
                          Delete your profile, along with your authentication
                          associations. This does not include applications
                          permissions. You will have to remove them yourself:
                        </li>
                        <li>
                          Delete any and all content you have, such as jobs
                          posted, personal information.
                        </li>
                        <li>
                          Allow your username to become available to anyone.
                        </li>
                      </ul>
                      <button className="bg-red-600 text-white rounded-md font-medium text-lg p-2 hover:bg-red-700">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
