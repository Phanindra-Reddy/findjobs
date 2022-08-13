import React, { useEffect, useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { v4 as uuidv4 } from "uuid";
import { notifyError, notifySuccess } from "../../../utils/toasters";
import { useRouter } from "next/router";
import { useAuth } from "../../../hooks/AuthContext";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { firestore } from "../../../utils/firebase";
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

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

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
    ["link", "image"],
    ["clean"],
  ],
};

const EditDrive = () => {
  const currentTime = new Date().toLocaleString("en-Us", {
    timeZone: "Asia/Kolkata",
  });
  const router = useRouter();
  const { driveID } = router.query;
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [eligibility, setEligibility] = useState("");
  const [skills, setSkills] = useState("");
  const [editDrive, setEditDrive] = useState({
    title: "",
    company_name: "",
    role: "",
    apply_link: "",
    experience: "",
    location: "",
    date_posted: new Date(),
    eligibility: "",
    skills_required: "",
  });

  const fetchDocument = async () => {
    setIsLoading(true);

    try {
      const q = query(
        collection(firestore, "users"),
        where("uid", "==", currentUser?.uid)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      data.map(async (elem) => {
        const workQ = query(collection(firestore, `users/${elem.id}/drives`));
        const workDetails = await getDocs(workQ);
        const workInfo = workDetails.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        let drive_details = workInfo?.filter(
          (drive) => drive?.id === driveID[0]
        );

        setEditDrive({
          title: drive_details[0]?.title,
          company_name: drive_details[0]?.company_name,
          role: drive_details[0]?.role,
          apply_link: drive_details[0]?.apply_link,
          experience: drive_details[0]?.experience,
          location: drive_details[0]?.location,
          date_posted: drive_details[0]?.date_posted,
        });
        setEligibility(drive_details[0]?.eligibility);
        setSkills(drive_details[0]?.skills_required);
      });
    } catch (error) {
      console.log(error.messgae);
      notifyError(`${error.messgae}`);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchDocument();
  }, [driveID]);

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

  const updateDrive = async (e) => {
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

      const docRef = doc(firestore, `users/${docID}/drives/${driveID}`);
      updateDoc(docRef, {
        id: driveID,
        company_name: editDrive?.company_name,
        role: editDrive?.role,
        apply_link: editDrive?.apply_link,
        experience: editDrive?.experience,
        location: editDrive?.location,
        date_posted: editDrive?.date_posted,
        eligibility: eligibility,
        skills_required: skills,
        updatedAt: currentTime,
      });
    } catch (error) {
      console.log(error.messgae);
      notifyError(`${error.messgae}`);
    }

    setIsUpdate(false);
    notifySuccess("Hiring drive updated successfully.");
    router.push("/hiring-drives-posted");
  };

  const onEditorDescriptionStateChange = (value) => {
    setSkills(value);
  };

  const onEditorEligibilityStateChange = (value) => {
    setEligibility(value);
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
        <title>Edit Hiring Drive | Find Jobs</title>
        <meta
          name="description"
          content="Find Jobs is online job finding portal. Developed and Designed by Phanindra Reddy."
        />
        <link rel="icon" href="/findjobnavbluewhite.svg" />
      </Head>
      <div className="md:mx-10 mb-10">
        <h1 className="text-center my-5 text-3xl font-medium underline text-blue-700">
          Edit Hiring Drive
        </h1>
        <h1 className="text-xl font-medium ml-5 mt-5">
          Hi {currentUser ? currentUser?.displayName : "Guest"}
          {generateGreetings()}
        </h1>

        <div>
          <div className="mt-10 sm:mt-0">
            <div className="mt-5">
              <form onSubmit={updateDrive}>
                <div className="shadow overflow-hidden sm:rounded-md">
                  <div className="px-4 py-5 bg-white sm:p-6">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-6 lg:col-span-6">
                        <label
                          htmlFor="title"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Title
                        </label>
                        <div>
                          <input
                            type="text"
                            id="title"
                            name="title"
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            placeholder="COGNIZANT IS HIRING: 2019/2020/2021/2022"
                            value={editDrive?.title}
                            onChange={(e) =>
                              setEditDrive({
                                ...editDrive,
                                title: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

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
                          value={editDrive?.company_name}
                          onChange={(e) =>
                            setEditDrive({
                              ...editDrive,
                              company_name: e.target.value,
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
                          value={editDrive?.role}
                          onChange={(e) =>
                            setEditDrive({
                              ...editDrive,
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
                          value={editDrive?.apply_link}
                          onChange={(e) =>
                            setEditDrive({
                              ...editDrive,
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
                          placeholder="Fresher or 2-8 years or 10+ years"
                          autoComplete="family-name"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          required
                          value={editDrive?.experience}
                          onChange={(e) =>
                            setEditDrive({
                              ...editDrive,
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
                          placeholder="Hyderabad, Telangana, India"
                          autoComplete="family-name"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          required
                          value={editDrive?.location}
                          onChange={(e) =>
                            setEditDrive({
                              ...editDrive,
                              location: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
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
                          value={editDrive?.date_posted}
                          onChange={(e) =>
                            setEditDrive({
                              ...editDrive,
                              date_posted: e.target.value,
                            })
                          }
                        />

                        {/* <DatePicker
                          name="date-posted"
                          id="date-posted"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          selected={editDrive?.date_posted}
                          onChange={(date) =>
                            setEditDrive({
                              ...editDrive,
                              date_posted: date,
                            })
                          }
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          timeCaption="time"
                          dateFormat="MMMM d, yyyy h:mm aa"
                        /> */}
                      </div>

                      <div className="col-span-6 sm:col-span-6 lg:col-span-6">
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Eligibility
                        </label>
                        <div className="mt-1">
                          <ReactQuill
                            placeholder="Write eligibility here..."
                            theme="snow"
                            value={eligibility}
                            onChange={onEditorEligibilityStateChange}
                            modules={modules}
                          />
                        </div>
                      </div>

                      <div className="col-span-6 sm:col-span-6 lg:col-span-6">
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Skills Required & Description
                        </label>
                        <div className="mt-1">
                          <ReactQuill
                            placeholder="Write skills required and description here..."
                            theme="snow"
                            value={skills}
                            onChange={onEditorDescriptionStateChange}
                            modules={modules}
                          />
                        </div>
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
                          Updating hiring drive...
                        </>
                      ) : (
                        <>Update Hiring Drive</>
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

export default EditDrive;
