import { useEffect, useState, type RefObject } from "react";

type UseElementWidthOptions = {
  padding?: number;
  min?: number;
  max?: number;
  initial?: number;
};

export function useElementWidth(
  ref: RefObject<HTMLElement | null>,
  { padding = 0, min, max, initial = 0 }: UseElementWidthOptions = {},
) {
  const [width, setWidth] = useState(initial);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const updateWidth = () => {
      const nextWidth = Math.floor(element.clientWidth - padding);
      const boundedMin = typeof min === "number" ? Math.max(min, nextWidth) : nextWidth;
      const bounded = typeof max === "number" ? Math.min(max, boundedMin) : boundedMin;
      setWidth(bounded);
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);

    return () => observer.disconnect();
  }, [max, min, padding, ref]);

  return width;
}
