import { v4 as uuidv4 } from "uuid";
import {
  doc,
  query,
  serverTimestamp,
  setDoc,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { useState, useEffect } from "react";
import { firestore, storage } from "../utils/firebase";
import { notifyError } from "../utils/toasters";

const useStorage = (file, currentUser, selectedChatUser, emailID) => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (file) {
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percentage = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(percentage);
        },
        (err) => setError(err),
        async () => {
          const senderDbRef = query(
            collection(firestore, "users"),
            where("username", "==", currentUser?.email?.split("@")[0])
          );

          const recieverDbRef = query(
            collection(firestore, "users"),
            where("username", "==", selectedChatUser?.to?.email?.split("@")[0])
          );

          let senderDocs = await getDocs(senderDbRef);
          let recieverDocs = await getDocs(recieverDbRef);
          let msgID = uuidv4();

          //image url from firebase storage
          const url = await getDownloadURL(storageRef).then((url) => {
            return url;
          });

          const timestamp = serverTimestamp();

          if (currentUser && selectedChatUser) {
            senderDocs?.docs?.map(async (v) => {
              await setDoc(
                doc(
                  firestore,
                  `users/${v.id}/chats/${emailID}/messages`,
                  msgID
                ),
                {
                  text: "",
                  image: url,
                  sender: currentUser?.email,
                  reciever: selectedChatUser?.to?.email,
                  timestamp: timestamp,
                  isImage: true,
                }
              );
            });

            recieverDocs?.docs?.map(async (v) => {
              await setDoc(
                doc(
                  firestore,
                  `users/${v.id}/chats/${selectedChatUser?.from?.email}/messages`,
                  msgID
                ),
                {
                  text: "",
                  image: url,
                  sender: selectedChatUser?.from?.email,
                  reciever: selectedChatUser?.to?.email,
                  timestamp: timestamp,
                  isImage: true,
                }
              );
            });
          } else {
            setProgress(0);
            notifyError(`Error while sending ${file?.name} image!`);
          }
          setProgress(0);
          setUrl(url);
        }
      );
    }
  }, [file]);

  return { url, progress, error };
};

export default useStorage;
