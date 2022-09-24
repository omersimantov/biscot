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
      className="h-screen w-screen bg-neutral-900 cursor-pointer block sm:flex items-center justify-center md:bg-neutral-900/90 overflow-auto fixed left-0 top-0 z-50"
      onClick={closeModalOnBGClick}>
      <XMarkIcon
        className="w-7 cursor-pointer text-neutral-500 hover:text-white fixed top-10 right-10"
        onClick={toggle}
      />
      <div className="flex items-center justify-center p-10 border-border md:h-fit h-full md:border bg-bg md:rounded-lg w-full md:max-w-prose cursor-auto overflow-auto">
        {content}
      </div>
    </div>
  );
};
