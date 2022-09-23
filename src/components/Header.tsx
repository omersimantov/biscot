import { Bars3Icon, CakeIcon } from "@heroicons/react/24/outline";

export const Header = (): JSX.Element => {
  return (
    <header className="border-b border-border h-16 px-10 flex items-center justify-between w-full bg-neutral-800">
      <CakeIcon className="w-7 text-neutral-500" />
      <Bars3Icon className="w-7 text-neutral-500 hover:text-white cursor-pointer" />
    </header>
  );
};
