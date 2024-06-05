"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Button, buttonVariants } from "@/components/ui/button"
import { useToast } from "./ui/use-toast"
import { CirclePlus, ArrowBigRightDash, Copy } from 'lucide-react';
import { useState } from "react";
import Link from "next/link";


export default function CreateRoom() {
  const [Code] = useState(generateRandomNumber());
  const { toast } = useToast()

  function generateRandomNumber() {
    const num = Math.floor(100000 + Math.random() * 900000);
    const numString = num.toString();
    return numString.split('');
  }
  const handleCopyCode = () => {
    navigator.clipboard.writeText(Code.join(''));
    toast({
      title: <p className="font-bold text-lg">{Code.join('')}</p>,
      description: "Code copied successfully",
    })
  };
  return (
    <Dialog>
      <DialogTrigger className={buttonVariants({ size: 'lg', variant:"secondary" })}>
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
              <div key={index} className="border rounded bg-neutral-700/80 text-neutral-100 text-lg font-semibold aspect-square h-8 grid place-items-center">{digit}</div>
            ))}
          </div>
          <Button variant="ghost" onClick={handleCopyCode} className="h-auto px-4 py-2"><Copy className="h-4 w-4" /></Button>
        </div>
        <DialogFooter>
          <Link className={buttonVariants()} href={`/room/${Code.join('')}`}>Enter <ArrowBigRightDash className="ml-2 h-4 w-4" /></Link>
        </DialogFooter>
      </DialogContent>

    </Dialog>
  )
}