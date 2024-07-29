import { Avatar, AvatarImage } from "./ui/avatar";
import { SignalHigh } from "lucide-react";
import Clock from "./clock";
import { memo } from "react";

interface PropTypes {
  name: string;
  num: number;
  active: boolean;
}

export default memo(function Player({ name, num, active }: PropTypes) {
  return (
    <div className="m-3 flex justify-between">
      <div className="flex space-x-2 items-center">
        <Avatar>
          <AvatarImage src={`/avatars/avatar-${num}.png`} />
        </Avatar>
        <h2 className="font-bold sm:text-lg text-xs">{name}</h2>
        <SignalHigh strokeWidth={3} className="text-green-500" />
      </div>
      <Clock active={active} />
    </div>
  );
});
