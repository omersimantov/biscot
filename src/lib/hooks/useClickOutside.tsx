import { RefObject, useEffect } from "react";

export const useClickOutside = (ref: RefObject<Element>, callback: () => void): void => {
  const handleClick = (e: MouseEvent): void => {
    e.stopPropagation();
    if (ref.current && !ref.current.contains(e.target as Node)) {
      callback();
    }
  };
  useEffect(() => {
    setTimeout(() => {
      document.addEventListener("click", handleClick);
    });
    return (): void => {
      document.removeEventListener("click", handleClick);
    };
  });
};
