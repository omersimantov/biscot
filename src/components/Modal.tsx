import { XMarkIcon } from "@heroicons/react/24/outline";
import { MouseEventHandler, useCallback, useEffect, useRef } from "react";

export const Modal = ({ toggle, content }: { content: JSX.Element; toggle: MouseEventHandler }): JSX.Element => {
  const bgRef = useRef<HTMLDivElement>(null);

  const closeModalOnBGClick = (e: React.MouseEvent<HTMLElement>): void => {
    toggle && bgRef.current === e.target && toggle(e);
  };

  // Toggle on escape key press
  const keyPress = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any) => {
      e.key === "Escape" && toggle(e);
    },
    [toggle]
  );

  useEffect(() => {
    document.addEventListener("keydown", keyPress);
    return (): void => {
      document.removeEventListener("keydown", keyPress);
    };
  }, [keyPress]);

  return (
    <div
      ref={bgRef}
      className="min-h-screen w-screen bg-neutral-900 cursor-pointer block md:flex items-center max-h-fit justify-center md:bg-neutral-900/90 fixed left-0 top-0 z-10"
      onClick={closeModalOnBGClick}>
      <XMarkIcon
        className="hidden md:block w-7 cursor-pointer text-neutral-500 hover:text-white md:fixed top-0 right-0 m-10"
        onClick={toggle}
      />
      <div className="md:my-10 p-5 sm:p-10 md:h-fit md:max-h-[calc(100vh-5rem)] overscroll-y-none h-screen md:border bg-bg md:rounded-lg w-full md:max-w-xl cursor-auto">
        <div className="flex justify-end md:hidden">
          <XMarkIcon className="w-7 cursor-pointer text-neutral-500 hover:text-white" onClick={toggle} />
        </div>
        <div className="py-5 sm:py-10 md:py-0">{content}</div>
      </div>
    </div>
  );
};
