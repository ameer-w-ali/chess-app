import { memo } from "react";

export default memo(function Ledger({ moves }: { moves: string[] }) {
  const turns = [];
  for (let i = 0; i < moves.length; i += 2) {
    turns.push({
      white: moves[i],
      black: moves[i + 1] || "",
    });
  }

  return (
    <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg md:row-span-2 md:col-span-5">
      <h2 className="font-bold text-lg mb-4">Ledger</h2>
      <div className="h-3/4 overflow-y-scroll custom-scrollbar">
        {turns.map((turn, index) => (
          <div key={index} className="flex gap-x-32">
            <div className="p-2 font-bold">{index + 1}.</div>
            <div className="p-2 font-bold">{turn.white}</div>
            <div className="p-2 font-bold">{turn.black}</div>
          </div>
        ))}
      </div>
    </div>
  );
});
