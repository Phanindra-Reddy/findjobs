import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { collection, getDocs, query, where, doc } from "firebase/firestore";
import { firestore } from "../../utils/firebase";

const UserProfile = () => {
  const router = useRouter();
  const { userID } = router.query;
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState();

  const fetchUser = async () => {
    setIsLoading(true);

    const q = query(
      collection(firestore, "users"),
      where("username", "==", userID[0])
    );
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs[0].data();
    setUser(data);

    setIsLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, [userID]);

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
        <div className="border border-slate-200 rounded flex flex-col items-center justify-center py-5 m-2 mt-10 md:m-10">
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
    </>
  );
};

export default UserProfile;
