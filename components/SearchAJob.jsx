import React from "react";
import { useRouter } from "next/router";
import { SearchIcon } from "@heroicons/react/solid";

const SearchAJob = ({ searchParams, setSearchParams }) => {
  const router = useRouter();

  const findaJob = (e) => {
    e.preventDefault();

    router.push({
      pathname: `${
        router?.pathname === "/find-a-job/search"
          ? "search"
          : "find-a-job/search"
      }`,
      search: `?role=${searchParams?.role}&company=${searchParams?.company}&location=${searchParams?.location}`,
    });
  };

  return (
    <>
      <div className="bg-white mx-10 md:mx-48 p-3 rounded shadow-2xl">
        <form
          onSubmit={findaJob}
          className="flex flex-col md:flex-row items-center justify-center"
        >
          <input
            id="skill"
            type="text"
            placeholder="Skill or Role"
            className="w-full my-2 md:mr-2 rounded border border-slate-300"
            value={searchParams?.role}
            onChange={(e) =>
              setSearchParams({
                ...searchParams,
                role: e.target.value,
              })
            }
          />

          <input
            id="company"
            type="text"
            placeholder="Company"
            className="w-full my-2 md:mr-2 rounded border border-slate-300"
            value={searchParams?.company}
            onChange={(e) =>
              setSearchParams({
                ...searchParams,
                company: e.target.value,
              })
            }
          />

          <input
            id="location"
            type="text"
            placeholder="Location/Locality"
            className="w-full my-2 md:mr-2 rounded border border-slate-300"
            value={searchParams?.location}
            onChange={(e) =>
              setSearchParams({
                ...searchParams,
                location: e.target.value,
              })
            }
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
