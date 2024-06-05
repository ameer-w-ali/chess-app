'use client'
import ChessboardComponent from "@/components/chessboard";

export default function page({ params }) {

  // console.log(params);
  return (
    <div className="flex h-svh px-12 py-4 space-x-2 bg-neutral-900">
      <ChessboardComponent />
      <div className="w-1/2 flex flex-col space-y-4">
        <div className="bg-neutral-600 h-1/2 rounded">

        </div>
        <div className="bg-neutral-600 h-1/2 rounded">

        </div>
      </div>
    </div>
  )
}