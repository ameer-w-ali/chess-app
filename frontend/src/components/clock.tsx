import { Clock12 } from "lucide-react";
import { useEffect, useState } from "react";
export default function Clock({ active }:{active:boolean}) {
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [counter, setCounter] = useState({ minutes: 10, seconds: 0 });

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

  return (
    <div
      className={`w-28 rounded flex items-center text-center px-4 font-bold  ${
        active
          ? "bg-neutral-200 text-neutral-800"
          : "bg-neutral-400 text-neutral-800 opacity-85"
      }`}
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
