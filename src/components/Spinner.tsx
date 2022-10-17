import classNames from "classnames";

export const Spinner = ({ className }: { className?: string }): JSX.Element => {
  return (
    <svg viewBox="0 0 50 50" className={classNames(className, "mx-auto h-2/5 max-h-6 animate-spinSlow")}>
      <circle
        className="animate-dash stroke-white pointer-events-none bg-transparent"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        strokeWidth="4"
      />
    </svg>
  );
};
