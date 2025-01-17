"use client";

import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { FC } from "react";
import { Button } from "../ui/button";
import { useFocusContext } from "./item-provider";

export const BackButton: FC<{
  componentId: string;
  componentName?: string;
  className: string;
}> = ({ componentId, componentName, className }) => {
  const { setFocusItem } = useFocusContext();
  return (
    <Button
      onClick={() => setFocusItem({ componentId })}
      className={cn("w-min gap-1 text-sm opacity-70 transition-colors text-neutral-600 hover:text-[inherit] mb-1", className)}
      size={"xs"}
      variant={"outline"}
    >
      <ArrowLeft size={8} />
      {componentName ?? "Component"}
    </Button>
  );
};
