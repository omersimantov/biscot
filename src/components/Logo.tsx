import { CakeIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";

export const Logo = ({ className }: { className?: string }): JSX.Element => {
  return <CakeIcon className={classNames("mx-auto", className)} strokeWidth={1} />;
};
