import { RectangleStackIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";

export const Logo = ({ className }: { className?: string }): JSX.Element => {
  return <RectangleStackIcon className={classNames("mx-auto", className)} strokeWidth={1} aria-label="Logo" />;
};
