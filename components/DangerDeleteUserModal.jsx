import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../hooks/AuthContext";
import { FirebaseApp } from "firebase/app";
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
  deleteDoc,
} from "firebase/firestore";
import { notifyError, notifyInfo, notifySuccess } from "../utils/toasters";

export default function DangerDeleteUserModal({
  deleteUserModal,
  handleDeleteUserModal,
}) {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [deleteInput, setDeleteInput] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);

  const deleteUser = async (val) => {
    setIsUpdate(true);

    if (!deleteInput) {
      notifyInfo(`Please type ${currentUser?.uid} to confirm.`);
      return;
    }

    if (val === deleteInput) {
      const q = query(
        collection(firestore, "users"),
        where("uid", "==", currentUser?.uid)
      );
      const querySnapshot = await getDocs(q);
      let docID = "";
      querySnapshot.forEach((doc) => {
        docID = doc.id;
      });

      const docRef = doc(firestore, `users/${docID}`);
      deleteDoc(docRef)
        .then(() => {
          currentUser.delete();
          notifySuccess("Your account delete successfully.");
          router.push("/login");
        })
        .catch((error) => {
          console.log(error.message);
          notifyError(`${error.message}`);
        });
    }
    setIsUpdate(false);
    handleDeleteUserModal();
  };

  return (
    <>
      <Transition appear show={deleteUserModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={handleDeleteUserModal}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-lg bg-white border-2 border-red-600 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Deleting Your Account
                  </Dialog.Title>
                  <div className="mt-2">
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
                  </div>

                  <div className="mt-4">
                    <form>
                      <div className="flex flex-col items-start">
                        <label htmlFor="deletealljobs" className="font-normal">
                          Please type{" "}
                          <span className="font-medium">
                            {currentUser?.uid}
                          </span>{" "}
                          to confirm.
                        </label>
                        <input
                          type="text"
                          id="deletealljobs"
                          name="deletealljobs"
                          placeholder=""
                          className="w-full rounded-md mt-2 mb-3"
                          value={deleteInput}
                          onChange={(e) => setDeleteInput(e.target.value)}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteUser(currentUser?.uid)}
                        className="w-full inline-flex justify-center rounded-md border border-red-600 px-4 py-2 text-sm font-medium text-red-600 hover:text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2"
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
                            Deleting your account...
                          </>
                        ) : (
                          <>Delete My Account</>
                        )}
                      </button>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
