import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="max-w-md w-full p-6">
        <h1 className="text-3xl font-bold mb-4">NutriFind</h1>
        <p className="mb-6 text-zinc-600">Find foods and recipes for your nutrition goals, and analyze products with Yuka-style scoring.</p>
        <div className="space-y-3">
          <Link href="/results" className="block w-full text-center py-3 bg-green-600 text-white rounded-full">Search</Link>
          <Link href="/plate" className="block w-full text-center py-3 border rounded-full">My Plate</Link>
        </div>
      </div>
    </div>
  );
}
