import React, { useEffect, useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { v4 as uuidv4 } from "uuid";
import { notifyError, notifySuccess } from "../utils/toasters";
import { useRouter } from "next/router";
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
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import moment from "moment";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import Image from "next/image";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
    ["link"],
    ["clean"],
  ],
};

const PostaJob = () => {
  const currentTime = new Date().toLocaleString("en-Us", {
    timeZone: "Asia/Kolkata",
  });
  const router = useRouter();
  const { currentUser } = useAuth();
  const [isUpdate, setIsUpdate] = useState(false);

  const [newJob, setNewJob] = useState({
    company_name: "",
    company_url: "",
    company_logo: "",
    role: "",
    apply_link: "",
    experience: "",
    location: "",
    date_posted: "",
    job_type: "",
    onsite_remote: "",
    description: "",
    tags: "",
  });

  useEffect(() => {
    if (!currentUser) {
      router.push("login");
      return;
    }
  }, [currentUser]);

  function generateGreetings() {
    var currentHour = moment().format("HH");

    if (currentHour >= 3 && currentHour < 12) {
      return ", Good Morning.";
    } else if (currentHour >= 12 && currentHour < 15) {
      return ", Good Afternoon.";
    } else if (currentHour >= 15 && currentHour < 20) {
      return ", Good Evening.";
    } else if (currentHour >= 20 && currentHour < 3) {
      return ", Good Night.";
    } else {
      return;
    }
  }

  const postJob = async (e) => {
    e.preventDefault();

    setIsUpdate(true);

    const q = query(
      collection(firestore, "users"),
      where("uid", "==", currentUser?.uid)
    );
    const docs = await getDocs(q);

    let jobID = uuidv4();

    docs?.docs?.map(async (v) => {
      await setDoc(doc(firestore, `users/${v.id}/jobs`, jobID), {
        id: jobID,
        company_name: newJob?.company_name,
        company_url: newJob?.company_url,
        company_logo: `https://logo.clearbit.com/:${newJob?.company_url}`,
        role: newJob?.role,
        apply_link: newJob?.apply_link,
        experience: newJob?.experience,
        location: newJob?.location,
        date_posted: newJob?.date_posted,
        job_type: newJob?.job_type,
        onsite_remote: newJob?.onsite_remote,
        description: newJob?.description,
        tags: newJob?.tags,
        posted_by: currentUser?.email?.split("@")[0],
        createdAt: currentTime,
        updatedAt: currentTime,
      });
    });

    setIsUpdate(false);
    notifySuccess("Job added successfully.");
    router.push("jobs-posted");
    setNewJob({
      company_name: "",
      company_url: "",
      company_logo: "",
      role: "",
      apply_link: "",
      experience: "",
      location: "",
      date_posted: "",
      job_type: "",
      onsite_remote: "",
      description: "",
      tags: "",
    });
  };

  const onEditorStateChange = (value) => {
    setNewJob({
      ...newJob,
      description: value,
    });
  };

  console.log(newJob?.company_url);

  return (
    <>
      <Head>
        <title>Post a job | Find Jobs</title>
        <meta
          name="description"
          content="Find Jobs is online job finding portal. Developed and Designed by Phanindra Reddy."
        />
        <link rel="icon" href="/findjobnavbluewhite.svg" />
      </Head>
      <div className="md:mx-10 mb-10">
        <h1 className="text-center my-5 text-3xl font-medium underline text-blue-700">
          Post a Job
        </h1>
        <h1 className="text-xl font-medium ml-5 mt-5">
          Hi {currentUser ? currentUser?.displayName : "Guest"}
          {generateGreetings()}
        </h1>
        <div>
          <div className="mt-10 sm:mt-0">
            <div className="mt-5">
              <form onSubmit={postJob}>
                <div className="shadow overflow-hidden sm:rounded-md">
                  <div className="px-4 py-5 bg-white sm:p-6">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="company_name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Company Name
                        </label>
                        <input
                          type="text"
                          name="company_name"
                          id="company_name"
                          placeholder="Google"
                          autoComplete="given-name"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md "
                          required
                          value={newJob?.company_name}
                          onChange={(e) =>
                            setNewJob({
                              ...newJob,
                              company_name: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="company_url"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Company Url
                        </label>
                        <input
                          type="text"
                          name="company_url"
                          id="company_url"
                          placeholder="https://www.google.com"
                          autoComplete="family-name"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          required
                          value={newJob?.company_url}
                          onChange={(e) =>
                            setNewJob({
                              ...newJob,
                              company_url: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="role"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Role
                        </label>
                        <input
                          type="text"
                          name="role"
                          id="role"
                          placeholder="Software Engineer"
                          autoComplete="family-name"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          required
                          value={newJob?.role}
                          onChange={(e) =>
                            setNewJob({
                              ...newJob,
                              role: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="apply_link"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Apply Link
                        </label>
                        <input
                          type="text"
                          name="apply_link"
                          id="apply_link"
                          placeholder="https://www.google.com/about/careers/applications/jobId=CiUAL2FckcbDDsa70OJR74PwAxY64yQjAPMJuDOXBLZgvcaTCY8FEjsAf5eZOCJkmqBA0r3kggIaYS_Z31lu9-H2-hXEE8m_-wxoIp_S2kQBBhG2izDXujcuyiXdjXs1G8WQjw%3D%3D_V2"
                          autoComplete="family-name"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          required
                          value={newJob?.apply_link}
                          onChange={(e) =>
                            setNewJob({
                              ...newJob,
                              apply_link: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="experience"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Experience
                        </label>
                        <input
                          type="text"
                          name="experience"
                          id="experience"
                          placeholder="2-8 years or 10+ years"
                          autoComplete="family-name"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          required
                          value={newJob?.experience}
                          onChange={(e) =>
                            setNewJob({
                              ...newJob,
                              experience: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="location"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Location
                        </label>
                        <input
                          type="text"
                          name="location"
                          id="location"
                          placeholder="Hyderabad, India"
                          autoComplete="family-name"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          required
                          value={newJob?.location}
                          onChange={(e) =>
                            setNewJob({
                              ...newJob,
                              location: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                        <label
                          htmlFor="date-posted"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Date Posted
                        </label>
                        <input
                          type="text"
                          name="date-posted"
                          id="date-posted"
                          placeholder="27-05-2022"
                          autoComplete="address-level2"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          required
                          value={newJob?.date_posted}
                          onChange={(e) =>
                            setNewJob({
                              ...newJob,
                              date_posted: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                        <label
                          htmlFor="job_type"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Job Type(Availability)
                        </label>
                        {/* <input
                        type="text"
                        name="job_type"
                        id="job_type"
                        autoComplete="address-level1"
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        required
                        value={newJob?.job_type}
                        onChange={(e) =>
                          setNewJob({
                            ...newJob,
                            job_type: e.target.value,
                          })
                        }
                      /> */}
                        <select
                          id="job_type"
                          name="job_type"
                          placeholder="Full-Time"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          value={newJob?.job_type}
                          onChange={(e) =>
                            setNewJob({
                              ...newJob,
                              job_type: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Availability</option>
                          <option value="Full Time">Full Time</option>
                          <option value="Part Time">Part Time</option>
                          <option value="Contract">Contract</option>
                          <option value="Remote Work">Remote Work</option>
                          <option value="Code Collab">Code Collab</option>
                          <option value="Immediate Joiner">
                            Immediate Joiner
                          </option>
                          <option value="Internship">Internship</option>
                        </select>
                      </div>

                      <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                        <label
                          htmlFor="onsite_remote"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Onsite/Remote/Hybrid
                        </label>
                        {/* <input
                          type="text"
                          name="onsite_remote"
                          id="onsite_remote"
                          autoComplete="onsite-remote"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          required
                          value={newJob?.onsite_remote}
                          onChange={(e) =>
                            setNewJob({
                              ...newJob,
                              onsite_remote: e.target.value,
                            })
                          }
                        /> */}
                        <select
                          id="onsite_remote"
                          name="onsite_remote"
                          placeholder="On-site"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          value={newJob?.onsite_remote}
                          onChange={(e) =>
                            setNewJob({
                              ...newJob,
                              onsite_remote: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Availability</option>
                          <option value="On-site">On-site</option>
                          <option value="Remote">Remote</option>
                          <option value="Hybrid">Hybrid</option>
                        </select>
                      </div>

                      <div className="col-span-6 sm:col-span-6 lg:col-span-6">
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Description
                        </label>
                        <div className="mt-1">
                          <ReactQuill
                            placeholder="Write job description here..."
                            theme="snow"
                            value={newJob?.description}
                            onChange={onEditorStateChange}
                            modules={modules}
                          />
                        </div>
                      </div>

                      <div className="col-span-6 sm:col-span-6 lg:col-span-6">
                        <label
                          htmlFor="tags"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Tags
                        </label>
                        <div>
                          <input
                            type="text"
                            id="tags"
                            name="tags"
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            placeholder="reactjs, javadeveloper, jobs"
                            value={newJob?.tags}
                            onChange={(e) =>
                              setNewJob({
                                ...newJob,
                                tags: e.target.value,
                              })
                            }
                          />
                          <small className="text-xs text-red-700 font-medium flex items-center text-center">
                            <span className="text-xl font-bold mr-1">*</span>{" "}
                            Separate tags by comma.(Ex: reactjs, javajobs,
                            software, itjobs)
                          </small>
                        </div>

                        <div className="col-span-6 sm:col-span-6 lg:col-span-6 mt-2">
                          <label
                            htmlFor="company_logo"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Company Logo
                          </label>
                          <div className="py-5">
                            {newJob?.company_url ? (
                              <>
                                <Image
                                  src={`https://logo.clearbit.com/:${newJob?.company_url}`}
                                  alt="findjob"
                                  width={100}
                                  height={100}
                                />
                              </>
                            ) : (
                              <>
                                <Image
                                  src="/company_fake_logo.webp"
                                  alt="findjob"
                                  width={100}
                                  height={100}
                                />
                              </>
                            )}
                          </div>
                          <small className="break-words">
                            company logo will be shown automatically based on company
                            url. If logo is not showing then it is our fault, but we will show a default logo.
                          </small>
                        </div>

                        <div className="mt-1"></div>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center py-2 px-10 border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {isUpdate ? (
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
                          Posting job...
                        </>
                      ) : (
                        <>Post Job</>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostaJob;
