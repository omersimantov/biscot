export const ListSkeleton = (): JSX.Element => {
  return (
    <div className="px-5 sm:px-10 min-w-fit">
      <div className="animate-pulse h-full bg-neutral-800 rounded-lg p-3 font-medium w-72" />
    </div>
  );
};
