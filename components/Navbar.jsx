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
    <div className="sticky top-0 z-10">
      <nav className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center md:justify-between h-16">
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
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link href="/">
                  <a className="text-2xl text-white font-medium">FindJobs</a>
                </Link>
              </div>
            </div>
            {!currentUser ? (
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
            ) : (
              <div className="ml-10 flex items-center space-x-4">
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
          {(ref) => (
            <div className="md:hidden" id="mobile-menu">
              <div ref={ref} className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <Link href="/post-a-job">
                  <a className="text-center hover:bg-gray-700 text-white block px-3 py-2 rounded-md text-base font-medium">
                    Post a Job
                  </a>
                </Link>

                {currentUser ? (
                  <>
                    <Link href="jobs-posted">
                      <a className="text-center text-gray-300 hover:bg-blue-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                        Jobs Posted
                      </a>
                    </Link>

                    <Link href="profile">
                      <a className="text-center text-gray-300 hover:bg-blue-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                        Profile
                      </a>
                    </Link>

                    <Link href="settings">
                      <a className="text-center text-gray-300 hover:bg-blue-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                        Settings
                      </a>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="login">
                      <a className="text-center text-gray-300 hover:bg-blue-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                        Login/Register
                      </a>
                    </Link>
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
