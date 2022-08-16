import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import { Fragment, useState, useEffect } from "react";
import { notifyError, notifyInfo, notifySuccess } from "../utils/toasters";
import { useAuth } from "../hooks/AuthContext";

export default function ChatRequestLoginModal({
  openChatLoginModal,
  setOpenChatLoginModal,
}) {
  const { signInWithGoogle, signInWithGithub, signInWithMicrosoft } = useAuth();

  return (
    <>
      <Transition appear show={openChatLoginModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setOpenChatLoginModal(!openChatLoginModal)}
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
                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-lg bg-white border-2 border-blue-600 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h2"
                    className="text-2xl font-medium leading-6 text-gray-900"
                  >
                    Login is required
                  </Dialog.Title>

                  <div className="flex flex-col md:px-20">
                    <h3 className="underline text-center my-5 md:mb-5">
                      Login/Register to your account with
                    </h3>
                    <button
                      onClick={() => {
                        signInWithGoogle();
                        setOpenChatLoginModal(!openChatLoginModal);
                      }}
                    >
                      <a className="flex items-center border-2 border-black rounded-md py-2 px-5 my-2 hover:border-blue-600">
                        <Image
                          src="/google.webp"
                          alt="google-login"
                          width={30}
                          height={30}
                        />
                        <p className="font-medium ml-5 text-xl">Google</p>
                      </a>
                    </button>
                    <button
                      onClick={() => {
                        signInWithGithub();
                      }}
                    >
                      <a className="flex items-center border-2 border-black rounded-md py-2 px-5 my-2 hover:border-blue-600">
                        <Image
                          src="/github.webp"
                          alt="github-login"
                          width={30}
                          height={30}
                        />
                        <p className="font-medium ml-5 text-xl">GitHub</p>
                      </a>
                    </button>
                    <button
                      onClick={() => {
                        signInWithMicrosoft();
                      }}
                    >
                      <a className="flex items-center border-2 border-black rounded-md py-2 px-5 my-2 hover:border-blue-600">
                        <Image
                          src="/microsoft.png"
                          alt="microsoft-login"
                          width={30}
                          height={30}
                        />
                        <p className="font-medium ml-5 text-xl">Microsoft</p>
                      </a>
                    </button>
                    <small className="text-center mt-5">
                      By continuing, you agree to accept our Privacy Policy &
                      Terms of Service.
                    </small>
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
