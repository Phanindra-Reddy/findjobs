import React, { useState, useEffect, useMemo } from "react";
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
  collectionGroup,
} from "firebase/firestore";
import moment from "moment";
import { BsFillEyeFill } from "react-icons/bs";
import SearchAJob from "../../components/SearchAJob";
import Pagination from "../../components/Pagination";
import { SearchIcon } from "@heroicons/react/solid";

const PageSize = 10;

const LatestHiringDrives = () => {
  const router = useRouter();
  const { currentUser } = useAuth();

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const firstPageIndex = (currentPage - 1) * PageSize;
  const lastPageIndex = firstPageIndex + PageSize;

  //fetching & searching for jobs
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    company: "",
  });
  const [allDrives, setAllDrives] = useState([]);

  const fetchAllDrives = async () => {
    setIsLoading(true);

    try {
      const res = query(collectionGroup(firestore, "drives"));
      const res2 = await getDocs(res);
      const data = res2.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setAllDrives(data);
    } catch (error) {
      console.log(error.messgae);
      notifyError(`${error.messgae}`);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchAllDrives();
  }, []);

  const findaDrive = (e) => {
    e.preventDefault();

    router.push({
      pathname: `${
        router?.pathname === "/latest-hiring-drives/search"
          ? "search"
          : "latest-hiring-drives/search"
      }`,
      search: `?company=${searchParams?.company}`,
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
        <title>Find latest hiring drive | Find Jobs</title>
        <meta
          name="description"
          content="Find Jobs is online job finding portal. Developed and Designed by Phanindra Reddy."
        />
        <link rel="icon" href="/findjobnavbluewhite.svg" />
      </Head>
      <div className="min-h-screen bg-gray-200">
        <div className="pt-5 md:mx-48">
          <div className="bg-white rounded shadow-2xl p-3">
            <form
              onSubmit={findaDrive}
              className="flex flex-row items-center justify-center"
            >
              <input
                id="company"
                type="text"
                placeholder="Company"
                className="w-full rounded border border-slate-300 mr-5"
                value={searchParams?.company}
                onChange={(e) =>
                  setSearchParams({
                    ...searchParams,
                    company: e.target.value,
                  })
                }
              />

              <button
                type="submit"
                className="rounded-md border-violet-500 text-white bg-gradient-to-r from-violet-500 to-fuchsia-500"
              >
                <SearchIcon className="h-10 w-10 p-2" />
              </button>
            </form>
          </div>
        </div>
        <div className="pb-10 px-2 md:px-48 mt-5">
          <div className=" bg-white border border-gray-300 rounded-md mx-1">
            {allDrives &&
              allDrives?.slice(firstPageIndex, lastPageIndex)?.map((drive) => (
                <div
                  key={drive?.id}
                  className="md:h-54 group cursor-pointer my-3 px-6 md:px-10 pb-4 flex flex-col border-b"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center">
                        <div className="mr-5">
                          {drive.company_logo ? (
                            <>
                              <Image
                                src={drive?.company_logo}
                                alt={drive?.company_name}
                                width={128}
                                height={128}
                              />
                            </>
                          ) : (
                            <>
                              <Image
                                src="/company_fake_logo.webp"
                                alt={drive?.company_name}
                                width={128}
                                height={128}
                              />
                            </>
                          )}
                        </div>
                        <div>
                          <h2
                            onClick={() =>
                              router.push(
                                `latest-hiring-drives/view/${drive?.id}`
                              )
                            }
                            className="text-xl text-blue-600 font-medium group-hover:underline"
                          >
                            {drive?.title}
                          </h2>
                          <p className="font-medium">{drive?.company_name}</p>
                        </div>
                      </div>
                      <p className="text-gray-500">
                        {drive?.location} {""}
                      </p>
                      <p className="text-gray-500">
                        {drive?.experience && drive?.experience} {""}
                      </p>
                    </div>

                    <div className="hidden md:block">
                      <button
                        onClick={() =>
                          router.push(`latest-hiring-drives/view/${drive?.id}`)
                        }
                        className="hidden group-hover:block"
                      >
                        <BsFillEyeFill className="h-6 w-6 mr-10" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <p className="text-green-700 font-semibold">
                      {drive?.date_posted &&
                        `Hiring Drive Posted on: ` +
                          moment(`${drive?.date_posted}`).format("MM-DD-YYYY")}
                      <small className="font-normal text-black">
                        (On Company site)
                      </small>
                    </p>

                    {drive?.posted_by && (
                      <>
                        <div className="flex items-center my-2 md:m-0">
                          <p className="mr-2">Posted by: </p>
                          <Link href={`/user/${drive?.posted_by}`}>
                            <a className="text-blue-600 hover:underline hover:font-medium">
                              {drive?.posted_by}
                            </a>
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                  <p className="text-sm">
                    {drive?.createdAt === drive?.updatedAt
                      ? "Created At: " + `${drive?.createdAt}`
                      : "Updated At: " + `${drive?.updatedAt}`}
                  </p>
                  <div className="block md:hidden">
                    <button
                      onClick={() =>
                        router.push(`latest-hiring-drives/view/${drive?.id}`)
                      }
                      className="flex items-center justify-center w-full border border-blue-700 hover:bg-blue-700 hover:text-white p-1 my-2 rounded-md"
                    >
                      <BsFillEyeFill className="h-6 w-6" />
                      <p className="ml-2 font-medium">View Hring Drive</p>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="flex items-end justify-center pb-10">
          <Pagination
            className="pagination-bar"
            currentPage={currentPage}
            totalCount={allDrives.length}
            pageSize={PageSize}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>

      {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <h1 className="text-center text-3xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
          Coming Soon...
        </h1>
      </div> */}
    </>
  );
};

export default LatestHiringDrives;
