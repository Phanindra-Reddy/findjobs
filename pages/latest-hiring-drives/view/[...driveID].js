import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuth } from "../../../hooks/AuthContext";
import { firestore } from "../../../utils/firebase";
import {
  collectionGroup,
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
import moment from "moment";

const ViewDrive = () => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const { driveID } = router.query;

  const [isLoading, setIsLoading] = useState(false);
  const [filteredDrive, setFilteredDrive] = useState([]);

  const fetchDocument = async () => {
    // setIsLoading(true);

    // try {
    //   const q = query(
    //     collection(firestore, "users"),
    //     where("uid", "==", currentUser?.uid)
    //   );
    //   const snapshot = await getDocs(q);
    //   const data = snapshot.docs.map((doc) => ({
    //     ...doc.data(),
    //     id: doc.id,
    //   }));
    //   data.map(async (elem) => {
    //     const workQ = query(collection(firestore, `users/${elem.id}/drives`));
    //     const workDetails = await getDocs(workQ);
    //     const workInfo = workDetails.docs.map((doc) => ({
    //       ...doc.data(),
    //       id: doc.id,
    //     }));
    //     setFilteredDrive(workInfo);
    //   });
    // } catch (error) {
    //   console.log(error.message);
    //   notifyError(`${error.message}`);
    // }

    // setIsLoading(false);

    setIsLoading(true);

    try {
      const res = query(collectionGroup(firestore, "drives"));
      const res2 = await getDocs(res);
      const data = res2.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setFilteredDrive(data);
    } catch (error) {
      console.log(error.messgae);
      notifyError(`${error.messgae}`);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchDocument();
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
        <title>View Hiring Drive | Find Jobs</title>
        <meta
          name="description"
          content="Find Jobs is online job finding portal. Developed and Designed by Phanindra Reddy."
        />
        <link rel="icon" href="/findjobnavbluewhite.svg" />
      </Head>
      <div className="min-h-screen bg-slate-200 p-2 md:px-20 md:py-10">
        {filteredDrive
          ?.filter((drive) => drive?.id === driveID[0])
          ?.map((drive) => (
            <div
              key={drive?.id}
              className="bg-white border rounded-md p-4 md:p-10"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl md:text-3xl font-medium text-blue-600">
                    {drive?.title}
                  </h1>
                </div>
                <div className="hidden md:block flex-col">
                  <p>
                    Created At:{" "}
                    <span className="font-medium">{drive?.createdAt}</span>
                  </p>
                  <p>
                    Updated At:{" "}
                    <span className="font-medium">{drive?.updatedAt}</span>
                  </p>
                </div>
              </div>
              <div className="mt-5 my-1">
                <p>
                  Company:{" "}
                  <span className="font-medium">{drive?.company_name}</span>
                </p>
                <p>
                  Role: <span className="font-medium">{drive?.role}</span>
                </p>
                <p className="my-1">
                  Location:{" "}
                  <span className="font-medium">{drive?.location}</span>{" "}
                </p>
              </div>
              <div className="flex flex-col md:flex-row md:items-center my-1">
                <p className="mr-5">
                  Exp: <span className="font-medium">{drive?.experience}</span>
                </p>
                <p className="">
                  Date Posted:{" "}
                  <span className="font-medium">{drive?.date_posted}</span>
                  <small className="text-red-600">
                    (Date mentioned on company site.)
                  </small>
                </p>
              </div>
              <Link href={`${drive?.apply_link}`}>
                <a
                  target="_blank"
                  className="w-36 p-2 my-5 text-white flex items-center justify-center font-medium bg-blue-600 hover:bg-blue-800 rounded-3xl"
                >
                  <span className="mr-2">Apply Here</span>
                  <BiLinkExternal />
                </a>
              </Link>

              <div>
                {drive?.eligibility && (
                  <>
                    <h3 className="text-2xl font-medium underline mb-5">
                      Eligibility
                    </h3>
                    <div className="px-10">
                      {ReactHtmlParser(drive?.eligibility)}
                    </div>
                  </>
                )}
              </div>

              <div>
                {drive?.skills_required && (
                  <>
                    <h3 className="text-2xl font-medium underline mb-5">
                      Skills Required & Description
                    </h3>
                    {ReactHtmlParser(drive?.skills_required)}
                  </>
                )}
              </div>

              <div className="block md:hidden flex-col mt-10">
                <p>
                  Created At:{" "}
                  <span className="font-medium">{drive?.createdAt}</span>
                </p>
                <p>
                  Updated At:{" "}
                  <span className="font-medium">{drive?.updatedAt}</span>
                </p>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default ViewDrive;
