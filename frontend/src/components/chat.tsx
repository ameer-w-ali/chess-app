import { MESSAGE, Message } from "common";
import { useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type Proptype = {
  messages: Message[];
  sendMessage: (message: Message) => void;
};

export default function Chat({ messages, sendMessage }: Proptype) {
  const message = useRef<HTMLInputElement>(null);
  const chats = messages.filter((msg) => msg.type === MESSAGE);
  const handleSend = () => {
    if (!message.current || message.current.value.trim() === "") return;
    sendMessage({
      type: MESSAGE,
      payload: {
        message: message.current.value,
        type:'sent'
      },
    });
    message.current.value = "";
  };

  return (
    <div className="flex flex-col justify-between bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg md:row-span-2 md:col-span-5">
      <h2 className="font-bold text-lg mb-4">Chat Section</h2>
      <div className="flex flex-col flex-1 space-y-2 overflow-y-auto mb-2">
        {chats.map((chat, index) => (
          <div
            key={index}
            className={`max-w-fit p-2 rounded-lg ${
              chat.payload?.type === "sent"
                ? "bg-neutral-600 text-white self-end"
                : "bg-neutral-300 text-black self-start"
            }`}
          >
            <span>{chat.payload?.message}</span>
          </div>
        ))}
      </div>
      <div className="flex w-full items-center space-x-2 mt-auto">
        <Input
          className="bg-primary-foreground"
          type="text"
          placeholder="send message..."
          ref={message}
        />
        <Button onClick={handleSend} type="submit">Send</Button>
      </div>
    </div>
  );
}
