import { cn } from "@/lib/utils";
import { Clock12 } from "lucide-react";
import { useEffect, useState } from "react";

export default function Clock({ active }:{active:boolean}) {
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [counter, setCounter] = useState({ minutes: 10, seconds:0 });

  useEffect(() => {
    let rotationIntervalId:ReturnType<typeof setTimeout>;
    let timerIntervalId:ReturnType<typeof setInterval>;

    if (active) {
      rotationIntervalId = setInterval(() => {
        setRotationDegrees((degrees) => degrees + 90);
      }, 1000);

      timerIntervalId = setInterval(() => {
        setCounter((prevCounter) => {
          const newCounter = { ...prevCounter };

          if (newCounter.minutes === 0 && newCounter.seconds === 0) {
            clearInterval(timerIntervalId);
            return newCounter;
          }

          if (newCounter.seconds === 0) {
            newCounter.minutes -= 1;
            newCounter.seconds = 59;
          } else {
            newCounter.seconds -= 1;
          }

          return newCounter;
        });
      }, 1000);
    }

    return () => {
      clearInterval(rotationIntervalId);
      clearInterval(timerIntervalId);
    };
  }, [active]);


  const isLessThanOneMinute = counter.minutes === 0 && counter.seconds < 60;

  return (
    <div
      className={cn(
        "w-28 max-h-10 rounded flex items-center text-center px-4 font-bold",
        active 
          ? isLessThanOneMinute
            ? "animate-tick bg-red-600 text-white"
            : "bg-neutral-800 text-neutral-200 dark:bg-neutral-200 dark:text-neutral-800"
          : "bg-muted-foreground text-muted",
      )}
    >
      <Clock12
        strokeWidth={3}
        className={`mr-3 h-5 w-5 ${!active && "invisible"}`}
        style={{ transform: `rotate(${rotationDegrees}deg)` }}
      />
      <span>
        {counter.minutes < 10 ? "0" : ""}
        {counter.minutes}:{counter.seconds < 10 ? "0" : ""}
        {counter.seconds}
      </span>
    </div>
  );
}
