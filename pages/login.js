import Image from "next/image";
import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import {useRouter} from "next/router"
import { useAuth } from "../hooks/AuthContext";

const Login = () => {
  const { signInWithGoogle } = useAuth();
  const router = useRouter()

  return (
    <>
    <div className="flex flex-col md:flex-row items-center justify-between p-2 px-10 py-5">
      <div>
        <Image
          src="/find-job-login.webp"
          alt="login"
          width={600}
          height={400}
        />
      </div>
      <div className="flex flex-col w-80 md:w-1/3 md:mr-20">
        <h3 className="underline text-center my-5 md:mb-5">
          Create your account with
        </h3>
        <button
          onClick={() => {
            signInWithGoogle();
            // router.push("/")
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
        <button>
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
        <button>
          <a className="flex items-center border-2 border-black rounded-md py-2 px-5 my-2 hover:border-blue-600">
            <Image
              src="/linkedin.webp"
              alt="linkedin-login"
              width={30}
              height={30}
            />
            <p className="font-medium ml-5 text-xl">LinkedIn</p>
          </a>
        </button>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Login;
