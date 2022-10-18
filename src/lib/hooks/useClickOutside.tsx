/* eslint-disable @typescript-eslint/no-explicit-any */
import { RefObject, useEffect } from "react";

export const useClickOutside = (ref: RefObject<Element>, callback: () => void): void => {
  const handleClick = (e: any): void => {
    if (ref.current && !ref.current.contains(e.target)) {
      callback();
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClick);
    return (): void => {
      document.removeEventListener("click", handleClick);
    };
  });
};
