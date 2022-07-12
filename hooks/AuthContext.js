import React, { useState, useEffect, useContext, useCallback } from "react";
import { useRouter } from "next/router";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  OAuthProvider
} from "firebase/auth";

import { auth, firestore } from "../utils/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
} from "firebase/firestore";
import { notifyError, notifySuccess } from "../utils/toasters";

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const microsoftProvider = new OAuthProvider("microsoft.com");

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  async function signInWithGoogle() {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;
      const q = query(
        collection(firestore, "users"),
        where("uid", "==", user.uid)
      );
      const docs = await getDocs(q);
      if (docs.docs.length === 0) {
        await addDoc(collection(firestore, "users"), {
          uid: user?.uid,
          name: user?.displayName,
          email: user?.email,
          photoURL: user?.photoURL,
          username: user?.email?.split("@")[0],
          website: "",
          location: "",
          bio: "",
          linkedinUrl: "",
          githubUrl: "",
          twitterUrl: "",
          showEmail: true,
          showSocials: true,
          showProfile: true,
        });
      }
      router.push("/");
      notifySuccess("Login successfull.");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  async function signInWithGithub() {
    try {
      const res = await signInWithPopup(auth, githubProvider);
      const user = res.user;
      const q = query(
        collection(firestore, "users"),
        where("uid", "==", user.uid)
      );
      const docs = await getDocs(q);
      if (docs.docs.length === 0) {
        await addDoc(collection(firestore, "users"), {
          uid: user?.uid,
          name: user?.displayName,
          email: user?.email,
          photoURL: user?.photoURL,
          username: user?.email?.split("@")[0],
          website: "",
          location: "",
          bio: "",
          linkedinUrl: "",
          githubUrl: "",
          twitterUrl: "",
          showEmail: true,
          showSocials: true,
          showProfile: true,
        });
      }
      router.push("/");
      notifySuccess("Login successfull.");
    } catch (err) {
      console.error(err);
      notifyError(`${err.message}`);
    }
  }

  async function signInWithMicrosoft() {
    try {
      const res = await signInWithPopup(auth, microsoftProvider);
      const user = res.user;
      const q = query(
        collection(firestore, "users"),
        where("uid", "==", user.uid)
      );
      const docs = await getDocs(q);
      if (docs.docs.length === 0) {
        await addDoc(collection(firestore, "users"), {
          uid: user?.uid,
          name: user?.displayName,
          email: user?.email,
          photoURL: user?.photoURL,
          username: user?.email?.split("@")[0],
          website: "",
          location: "",
          bio: "",
          linkedinUrl: "",
          githubUrl: "",
          twitterUrl: "",
          showEmail: true,
          showSocials: true,
          showProfile: true,
        });
      }
      router.push("/");
      notifySuccess("Login successfull.");
    } catch (err) {
      console.error(err.message);
      notifyError(`${err.message}`)
    }
  }

  function logout() {
    return auth.signOut();
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email);
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signInWithGoogle,
    signInWithGithub,
    signInWithMicrosoft,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
