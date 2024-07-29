import CreateRoom from "@/components/create-room";
import JoinRoom from "@/components/join-room";

export default function Home() {
  return (
    <main className="h-lvh w-auto bg-center bg-cover bg-no-repeat bg-hero-image">
      <div className="h-full w-full backdrop-brightness-50 grid place-items-center">
        
        <div className="bg-neutral-50 dark:bg-neutral-900/80 p-8 rounded-md">
          <h2 className="text-4xl md:text-7xl font-black text-center text-lime-600">
            CHESS ROOM
          </h2>
          <div className="flex max-sm:space-x-4 sm:justify-around mt-6 sm:mt-12 items-center">
            <CreateRoom />
            <JoinRoom />
          </div>
        </div>
      </div>
    </main>
  );
}
