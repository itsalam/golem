import APICard from "@/components/cards/api-card";
import ComponentCard from "@/components/cards/ComponentCard.tsx";
import { fetchComponents } from "@/lib/client";
import { Component } from "@/lib/types";

export default async function Home() {
  const componentData: Component[] = await fetchComponents()

  return (
    <div className="grid-cols-subgrid grid-rows-subgrid grid col-span-full row-span-full px-3 gap-0 h-full">
      <ComponentCard components={componentData} />
      <APICard />
    </div>
  );
}
