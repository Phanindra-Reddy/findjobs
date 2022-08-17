import React, { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Transition, Menu } from "@headlessui/react";
import Link from "next/link";
import { useAuth } from "../hooks/AuthContext";
import { notifySuccess } from "../utils/toasters";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Navbar() {
  const router = useRouter();
  const { currentUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
    notifySuccess("Logout successfull.");
  };

  return (
    <div className="z-20">
      <nav className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="mr-2 flex md:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  type="button"
                  className="bg-gray-900 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  aria-controls="mobile-menu"
                  aria-expanded="false"
                >
                  <span className="sr-only">Open main menu</span>
                  {!isOpen ? (
                    <svg
                      className="block h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="block h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </button>
              </div>
              <div>
                <Link href="/">
                  <a className="text-2xl text-white font-medium flex items-center justify-center">
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
                    <p className="md:ml-3">FindJobs</p>
                  </a>
                </Link>
              </div>
            </div>
            {!currentUser ? (
              <>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    <Link href="/post-a-job">
                      <a className="text-white font-normal rounded-md border-none  px-3 py-2 hover:bg-blue-200 hover:text-blue-700 hover:underline">
                        Post a Job
                      </a>
                    </Link>
                    <Link href="/login">
                      <a className="text-white font-medium rounded-md border-2 border-blue-700 px-3 py-2 hover:bg-blue-700 hover:underline">
                        Login/Register
                      </a>
                    </Link>
                  </div>
                </div>
                <Link href="/login">
                  <a className="block md:hidden text-white font-medium rounded-md border-2 border-blue-700 ml-auto px-3 py-2 hover:bg-blue-700 hover:underline">
                    Login
                  </a>
                </Link>
              </>
            ) : (
              <div className="ml-10 flex items-center space-x-4">
                <Link href="/chat">
                  <a className="text-white font-medium rounded-md p-1 md:px-3 md:py-2 hover:underline hidden md:block">
                    Chat
                  </a>
                </Link>
                <Link href="/post-a-hiring-drive">
                  <a className="text-white font-medium rounded-md p-1 md:px-3 md:py-2 hover:underline hidden md:block">
                    Post a hiring drive
                  </a>
                </Link>
                <Link href="/post-a-job">
                  <a className="text-white font-medium rounded-md border-2 border-blue-700 p-1 md:px-3 md:py-2 hover:bg-blue-700 hover:underline md:mr-2">
                    + Post a Job
                  </a>
                </Link>
                <Menu as="div" className="ml-3 relative">
                  <div>
                    <Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-10 w-10 rounded-full"
                        src={`${currentUser?.photoURL}`}
                        alt="profile"
                        width={20}
                        height={20}
                      />
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
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <div className="block px-4 py-2 text-sm text-gray-700 cursor-pointer border-b-2">
                            <span className="text-md font-semibold">
                              {currentUser && currentUser?.displayName}
                            </span>
                            <br />
                            <span className="font-normal">
                              {currentUser && currentUser?.email}
                            </span>
                          </div>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <div
                            onClick={() => router.push("/jobs-posted")}
                            type="button"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-violet-500 hover:text-white"
                            )}
                          >
                            Jobs Posted
                          </div>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <div
                            onClick={() => router.push("/hiring-drives-posted")}
                            type="button"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-violet-500 hover:text-white"
                            )}
                          >
                            Drives Posted
                          </div>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <div
                            onClick={() => router.push("/profile")}
                            type="button"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-violet-500 hover:text-white"
                            )}
                          >
                            Your Profile
                          </div>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <div
                            onClick={() => router.push("/settings")}
                            type="button"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-violet-500 hover:text-white"
                            )}
                          >
                            Settings
                          </div>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <div
                            type="button"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-violet-500 hover:text-white"
                            )}
                            onClick={handleLogout}
                          >
                            Sign out
                          </div>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            )}
          </div>
        </div>

        <Transition
          show={isOpen}
          enter="transition ease-out duration-100 transform"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-75 transform"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          {() => (
            <div className="md:hidden" id="mobile-menu">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <button
                  onClick={() => {
                    router.push("/post-a-job");
                    setIsOpen(!open);
                  }}
                  className="w-full text-center hover:bg-gray-700 text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Post a Job
                </button>

                <button
                  onClick={() => {
                    router.push("/post-a-hiring-drive");
                    setIsOpen(!open);
                  }}
                  className="w-full text-center hover:bg-gray-700 text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Post a Hirirng Drive
                </button>

                <button
                  onClick={() => {
                    router.push("/chat");
                    setIsOpen(!open);
                  }}
                  className="w-full text-center hover:bg-gray-700 text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Chat Dashboard
                </button>

                {currentUser ? (
                  <>
                    <button
                      onClick={() => {
                        router.push("/jobs-posted");
                        setIsOpen(!open);
                      }}
                      className="w-full text-center text-gray-300 hover:bg-blue-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    >
                      Jobs Posted
                    </button>

                    <button
                      onClick={() => {
                        router.push("/hiring-drives-posted");
                        setIsOpen(!open);
                      }}
                      className="w-full text-center text-gray-300 hover:bg-blue-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    >
                      Drives Posted
                    </button>

                    <button
                      onClick={() => {
                        router.push("/profile");
                        setIsOpen(!open);
                      }}
                      className="w-full text-center text-gray-300 hover:bg-blue-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    >
                      Profile
                    </button>

                    <button
                      onClick={() => {
                        router.push("/settings");
                        setIsOpen(!open);
                      }}
                      className="w-full text-center text-gray-300 hover:bg-blue-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    >
                      Settings
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        router.push("/login");
                        setIsOpen(!open);
                      }}
                      className="w-full text-center hover:bg-gray-700 text-white block px-3 py-2 rounded-md text-base font-medium"
                    >
                      Login/Register
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </Transition>
      </nav>
    </div>
  );
}

export default Navbar;
