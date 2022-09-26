import { Bars3Icon, CakeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export const Header = (): JSX.Element => {
  return (
    <header className="border-b border-border h-16 px-5 sm:px-10 flex items-center justify-between bg-neutral-800">
      <Link href="/">
        <a>
          <CakeIcon className="w-7 text-neutral-500 hover:text-white" strokeWidth={1} />
        </a>
      </Link>
      <Bars3Icon className="w-7 text-neutral-500 hover:text-white cursor-pointer" strokeWidth={1} />
    </header>
  );
};
