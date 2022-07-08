import React from "react";
import { SearchIcon } from "@heroicons/react/solid";

const SearchAJob = () => {
  return (
    <>
      <div className="bg-white mx-10 md:mx-48 p-3 rounded shadow-2xl">
        <form className="flex flex-col md:flex-row items-center justify-center">
          <input
            id="skill"
            type="text"
            placeholder="Skill, Designation or Companies"
            className="w-full my-2 md:mr-2 rounded border border-slate-300"
          />

          <input
            id="location"
            type="text"
            placeholder="Location/Locality"
            className="w-full my-2 md:mr-2 rounded border border-slate-300"
          />

          <button
            type="submit"
            className="flex items-center rounded-md border-violet-500 text-white bg-gradient-to-r from-violet-500 to-fuchsia-500 px-3 py-1 my-2"
          >
            <SearchIcon className="h-10 w-10 p-2" />
            <span className="md:p-2 font-medium text-lg md:hidden">Search</span>
          </button>
        </form>
      </div>
    </>
  );
};

export default SearchAJob;
