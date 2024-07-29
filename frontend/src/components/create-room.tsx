"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button, buttonVariants } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { CirclePlus, ArrowBigRightDash, Copy } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function CreateRoom() {
  const [Code] = useState(generateRandomNumber());
  const { toast } = useToast();

  function generateRandomNumber() {
    const num = Math.floor(100000 + Math.random() * 900000);
    const numString = num.toString();
    return numString.split("");
  }
  const handleCopyCode = () => {
    const codeToCopy = Code.join("");

    navigator.clipboard
      .writeText(codeToCopy)
      .then(() => {
        toast({
          title: codeToCopy,
          description: "Code copied successfully",
        });
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast({
          title: "Error",
          description: "Failed to copy code",
        });
      });
  };

  return (
    <Dialog>
      <DialogTrigger className={buttonVariants({ size: "responsive" })}>
        Create Room <CirclePlus className="ml-2 h-4 w-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Room Code</DialogTitle>
          <DialogDescription>
            Share the given Code to your friend.
          </DialogDescription>
        </DialogHeader>
        <div className="flex space-x-4">
          <div className="flex space-x-2">
            {Code.map((digit, index) => (
              <div
                key={index}
                className="border rounded bg-neutral-700/80 text-neutral-100 text-lg font-semibold aspect-square h-8 grid place-items-center"
              >
                {digit}
              </div>
            ))}
          </div>
          <Button
            variant="ghost"
            onClick={handleCopyCode}
            className="h-auto px-3 py-2"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter>
          <Link className={buttonVariants()} to={`/room/${Code.join("")}`}>
            Enter <ArrowBigRightDash className="ml-2 h-4 w-4" />
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
