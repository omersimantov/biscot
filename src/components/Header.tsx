import { Bars3Icon, CakeIcon } from "@heroicons/react/24/outline";

export const Header = (): JSX.Element => {
  return (
    <header className="border-b border-border h-16 px-5 sm:px-10 flex items-center justify-between w-full bg-neutral-800">
      <CakeIcon className="w-7 text-white" strokeWidth={1} />
      <Bars3Icon className="w-7 text-white cursor-pointer" strokeWidth={1} />
    </header>
  );
};
