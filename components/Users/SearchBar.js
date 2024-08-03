"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const SearchBar = () => {
  const [searchString, setSearchString] = useState("");
  return (
    <div className="flex gap-4 items-center relative">
      <input value={searchString} onChange={(e) => setSearchString(e.target.value)} type="text" placeholder="Search" className="input" />
      <Link href={`users?search=${searchString}`} className="absolute right-[10px]">
        <Image src="/search.svg" width={20} height={20} alt="search-icon" />
      </Link>
    </div>
  );
};

export default SearchBar;
