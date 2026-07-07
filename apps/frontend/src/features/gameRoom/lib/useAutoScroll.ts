import { useEffect, type DependencyList, type RefObject } from "react";

type ScrollableElement = {
  scrollHeight: number;
  scrollTo: (options: { top: number; behavior?: ScrollBehavior }) => void;
};

export function useAutoScroll(
  refs: Array<RefObject<ScrollableElement | null>>,
  deps: DependencyList,
) {
  useEffect(() => {
    refs.forEach((ref) => {
      const element = ref.current;

      element?.scrollTo({
        top: element.scrollHeight,
        behavior: "smooth",
      });
    });
  }, deps);
}
