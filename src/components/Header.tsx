import { Logo } from "@/components/Logo";
import { Bars3Icon } from "@heroicons/react/24/outline";
import Link from "next/link";

export const Header = (): JSX.Element => {
  return (
    <header className="border-b h-16 px-5 sm:px-10 flex items-center justify-between bg-neutral-800">
      <Link href="/">
        <a aria-label="Logo">
          <Logo className="w-8 text-neutral-500 hover:text-white" />
        </a>
      </Link>
      <Bars3Icon className="w-8 text-neutral-500 hover:text-white cursor-pointer" strokeWidth={1} />
    </header>
  );
};
