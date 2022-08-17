import Image from "next/image";
import React from "react";
import { useRouter } from "next/router";

const ChatSideNav = ({ chatUsersList }) => {
  const router = useRouter();

  return (
    <>
      <ul className="list-none">
        {
           chatUsersList?.map((user) => (
            <li
              key={user?.id}
              className="p-2 px-5 border-b hover:bg-gray-200 cursor-pointer"
              onClick={() => {
                if (typeof window !== "undefined") {
                  localStorage.setItem(
                    "selectedChatUser",
                    JSON.stringify(user)
                  );
                }
                router.push(`chat/${user?.to?.email}`);
              }}
            >
              <div className="flex">
                <Image
                  src={user?.to?.photo}
                  alt="user"
                  height={40}
                  width={40}
                  className="rounded-full"
                />
                <p className="font-medium text-base ml-2">{user?.to?.name}</p>
              </div>
            </li>
          ))}
      </ul>
      {!chatUsersList?.length > 0 && (
        <div className="flex items-center justify-center">
          <p className="font-medium tetx-lg relative top-28">No users found</p>
        </div>
      )}
    </>
  );
};

export default ChatSideNav;
