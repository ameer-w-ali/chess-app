import { Avatar, AvatarImage } from "./ui/avatar";
import { Ban, SignalHigh, SignalLow, SignalMedium } from "lucide-react";
import Clock from "./clock";
import { memo } from "react";

interface PropTypes {
  name: string;
  num: number;
  active: boolean;
  ping: number | null;
}

export default function Player({ ping, name, num, active }: PropTypes) {
  return (
    <div className="m-3 flex justify-between">
      <div className="flex space-x-2 items-start h-10">
        <Avatar>
          <AvatarImage src={`/avatars/avatar-${num}.png`} />
        </Avatar>
        <div className="flex gap-x-3">
          <h2 className="font-bold sm:text-lg text-xs">{name}</h2>
          <Ping ping={50} />
        </div>
      </div>
        <Clock active={active} />
    </div>
  );
}

const Ping = memo(function PING({ ping }: { ping: number | null }) {
  if (ping === null)
    return (
      <Ban
        strokeWidth={3}
        className=" text-gray-600 dark:text-gray-400 animate-pulse"
      />
    );
  const getOpacity = (index: number) => {
    if (ping <= 50) return 1;
    if (ping <= 100) return index === 3 ? 0.5 : 1;
    if (ping <= 150) return index >= 2 ? 0.5 : 1;
    return index >= 1 ? 0.5 : 1;
  };

  return (
    <div className="inline-flex items-center gap-1 min-w-10 cursor-pointer flex-shrink-0">
      {[...Array(4)].map((_, index) => (
        <span
          key={index}
          className="bg-white rounded-lg flex-shrink-0 h-3 w-1"
          style={{ opacity: getOpacity(index) }}
        ></span>
      ))}
    </div>
  );
});
