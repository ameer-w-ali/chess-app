import { Message, MOVE } from "common";
import { memo, useEffect, useState } from "react";

type PropTypes = {
  messages: Message[];
  sendMessage: (message: Message) => void;
};
type Move = { from: string; to: string };

export default memo(function Ledger({ messages,sendMessage }: PropTypes) {
  console.log(messages);
  const [moves, setMoves] = useState<Move[]>([]);
  useEffect(() => {
    messages.filter((m) => {
      if (m.type === MOVE && m.payload && m.payload.move) {
        setMoves((prev) => [...prev, m.payload!.move!]);
        return true;
      } else return false;
    });
  },[messages]);

  return (
    <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg md:row-span-2 md:col-span-5">
      <h2 className="font-bold text-lg">Ledger</h2>
      <div className="flex justify-around">
      {moves.map((move, index) => (
        <div key={index}>
          <span>{index + 1}</span>
          <span>{move.from}</span>
          <span>{move.to}</span>
        </div>
      ))}

      </div>
    </div>
  );
});
