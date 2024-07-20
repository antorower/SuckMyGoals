import React from "react";
import Image from "next/image";
import Link from "next/link";

const MenuItem = ({ link, icon, size, alt, border }) => {
  return (
    <Link href={link} className={`h-[60px] ${border && "border-r"} border-gray-900 flex flex-grow justify-center items-center hover:bg-blue-600`}>
      <Image src={`/${icon}.svg`} width={size} height={size} alt={alt} />
    </Link>
  );
};

export default MenuItem;
