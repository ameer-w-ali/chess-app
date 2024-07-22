import { Avatar, AvatarImage } from "./ui/avatar";
import { Radio } from "lucide-react";
import Clock from "./clock";
import { memo } from "react";

interface PropTypes{
  name:string,
  num:number,
  active:boolean
}

export default memo(function Player({ name = "Player 1", num, active }:PropTypes) {
  return (
    <div className="m-3 flex justify-between">
      <div className="flex space-x-2 items-center">
        <Avatar>
          <AvatarImage src={`/avatars/avatar-${num}.png`} />
        </Avatar>
        <h2 className="font-bold text-lg">{name}</h2>
        <Radio className="h-4 w-4 font-bold text-green-500" />
      </div>
      <Clock active={active} />
    </div>
  );
});
