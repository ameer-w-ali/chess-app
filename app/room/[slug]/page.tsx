import Chess from "@/components/chess";
import { useRouter } from "next/router";

export default function page() {
  const router = useRouter();
  const { slug } = router.query;
  console.log(slug);
  
  return (
    <div className="flex h-svh px-12 py-4 space-x-2 bg-neutral-900">
      <Chess />
      <div className="w-1/2 flex flex-col space-y-4">
        <div className="bg-neutral-600 h-1/2 rounded"></div>
        <div className="bg-neutral-600 h-1/2 rounded"></div>
      </div>
    </div>
  );
}
