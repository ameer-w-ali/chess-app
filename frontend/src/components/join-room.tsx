"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "./ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { buttonVariants } from "./ui/button";
import { Unplug, Play } from "lucide-react";
import { Link } from "react-router-dom";
export default function JoinRoom() {
  const [value, setValue] = useState("");
  return (
    <Dialog>
      <DialogTrigger className={buttonVariants({ size: "responsive" })}>
        Join Room <Unplug className="ml-2 h-4 w-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter Room Code</DialogTitle>
          <DialogDescription>
            Provide to Room Code to Enter the Room.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
            value={value}
            onChange={(value) => setValue(value)}
            onComplete={(value) => setValue(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <DialogFooter>
          <Link to={`/room/${value}`} className={buttonVariants()}>
            Play <Play className="ml-2 h-4 w-4" />
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
