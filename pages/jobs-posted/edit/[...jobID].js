import React, { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { notifyError, notifySuccess } from "../../../utils/toasters";
import { useRouter } from "next/router";
import { useAuth } from "../../../hooks/AuthContext";
import { firestore } from "../../../utils/firebase";
import {
  collection,
  query,
  where,
  getDoc,
  getDocs,
  updateDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import moment from "moment";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    ["blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
    ["link"],
    ["clean"],
  ],
};

const EditJobId = () => {
  const router = useRouter();
  const { jobID } = router.query;
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [newJob, setNewJob] = useState({
    company_name: "",
    company_url: "",
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

  const fetchDocument = useCallback(async () => {
    setIsLoading(true);

    const q = query(collection(firestore, "users"));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    data.map(async (elem) => {
      const workQ = query(collection(firestore, `users/${elem.id}/jobs`));
      const workDetails = await getDocs(workQ);
      const workInfo = workDetails.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      let j_details = workInfo?.filter((job) => job?.id === jobID[0]);
      //console.log(j_details[0]);

      setNewJob({
        company_name: j_details[0]?.company_name,
        company_url: j_details[0]?.company_url,
        role: j_details[0]?.role,
        apply_link: j_details[0]?.apply_link,
        experience: j_details[0]?.experience,
        location: j_details[0]?.location,
        date_posted: j_details[0]?.date_posted,
        job_type: j_details[0]?.job_type,
        onsite_remote: j_details[0]?.onsite_remote,
        description: j_details[0]?.description,
        tags: j_details[0]?.tags,
      });
    });

    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchDocument();
  }, [jobID]);

  useEffect(() => {
    if (!currentUser) {
      router.push("login");
      return;
    }
  }, [currentUser]);

  function generateGreetings() {
    var currentHour = moment().format("HH");

    if (currentHour >= 3 && currentHour < 12) {
      return "Good Morning.";
    } else if (currentHour >= 12 && currentHour < 15) {
      return "Good Afternoon.";
    } else if (currentHour >= 15 && currentHour < 20) {
      return "Good Evening.";
    } else if (currentHour >= 20 && currentHour < 3) {
      return "Good Night.";
    } else {
      return "Hello.";
    }
  }

  const updateJob = async (e) => {
    e.preventDefault();

    setIsUpdate(true);

    try {
      const q = query(
        collection(firestore, "users"),
        where("uid", "==", currentUser?.uid)
      );
      const querySnapshot = await getDocs(q);
      let docID = "";
      querySnapshot.forEach((doc) => {
        docID = doc.id;
      });

      const docRef = doc(firestore, `users/${docID}/jobs/${jobID}`);
      updateDoc(docRef, {
        id: jobID,
        company_name: newJob?.company_name,
        company_url: newJob?.company_url,
        role: newJob?.role,
        apply_link: newJob?.apply_link,
        experience: newJob?.experience,
        location: newJob?.location,
        date_posted: newJob?.date_posted,
        job_type: newJob?.job_type,
        onsite_remote: newJob?.onsite_remote,
        description: newJob?.description,
        tags: newJob?.tags,
        updatedAt: moment(new Date()).format("MMMM Do YYYY, h:mm:ss a"),
      });
    } catch (error) {
      console.log(error.messgae);
      notifyError(`${error.messgae}`);
    }

    setIsUpdate(false);
    notifySuccess("Job updated successfully.");
    router.push("/jobs-posted");
  };

  const onEditorStateChange = (value) => {
    setNewJob({
      ...newJob,
      description: value,
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
    <div className="md:mx-10 mb-10">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <h1 className="text-2xl font-medium ml-5 mt-5">
          Hi {currentUser ? currentUser?.displayName : "Guest"},{" "}
          {generateGreetings()}
        </h1>
        <h5 className="mt-2 mx-auto md:m-0">
          {jobID && <span className="font-medium">{`Job ID: ${jobID}`}</span>}
        </h5>
      </div>
      <div>
        <div className="mt-10 sm:mt-0">
          <div className="mt-5">
            <form onSubmit={updateJob}>
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
                        Job Type
                      </label>
                      <input
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
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                      <label
                        htmlFor="onsite_remote"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Onsite/Remote/Hybrid
                      </label>
                      <input
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
                      />
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
                          theme="snow"
                          placeholder={"Write description here..."}
                          value={newJob?.description || ""}
                          onEditorStateChange={onEditorStateChange}
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
                        Updating job...
                      </>
                    ) : (
                      <>Update Job</>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditJobId;



