/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";

export const useClickOutside = (action: any): void => {
  useEffect(() => {
    document.addEventListener("click", action, false);
    return (): void => {
      document.removeEventListener("click", action, false);
    };
  }, []);
};
