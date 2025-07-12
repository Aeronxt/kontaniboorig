import React, { useEffect, useState } from "react";
import { cn } from "../../utils/cn";

interface MeteorsProps {
  number?: number;
  minDelay?: number;
  maxDelay?: number;
  className?: string;
}

export const Meteors = ({
  number = 20,
  minDelay = 0,
  maxDelay = 2,
  className,
}: MeteorsProps) => {
  const [meteorStyles, setMeteorStyles] = useState<Array<React.CSSProperties>>(
    [],
  );

  useEffect(() => {
    const styles = [...new Array(number)].map(() => ({
      "--angle": -(215 + Math.random() * 10) + "deg",
      top: Math.random() * 100 + "%",
      left: Math.random() * 100 + "%",
      animationDelay: Math.random() * (maxDelay - minDelay) + minDelay + "s",
    } as React.CSSProperties));
    setMeteorStyles(styles);
  }, [number, minDelay, maxDelay]);

  return (
    <>
      {[...meteorStyles].map((style, idx) => (
        <span
          key={idx}
          style={{ ...style }}
          className={cn(
            "pointer-events-none absolute size-0.5 rotate-[var(--angle)] animate-meteor rounded-full bg-slate-500 shadow-[0_0_0_1px_#ffffff10]",
            className,
          )}
        >
          <div className="pointer-events-none absolute top-1/2 -z-10 h-[1px] w-[50px] -translate-y-1/2 bg-gradient-to-r from-slate-500 to-transparent" />
        </span>
      ))}
    </>
  );
}; 