import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--muted)]">
      <div className="max-w-md w-full p-6">
        <h1 className="text-3xl font-bold mb-4">NutriFind</h1>
        <p className="mb-6 text-zinc-600">Find foods and recipes for your nutrition goals, and analyze products with Yuka-style scoring.</p>
        <div className="space-y-3">
          <button className="btn btn-primary w-full" onClick={() => router.push('/results')}>Search</button>
          <button className="btn btn-outline w-full" onClick={() => router.push('/plate')}>My Plate</button>
        </div>
      </div>
    </div>
  );
}
