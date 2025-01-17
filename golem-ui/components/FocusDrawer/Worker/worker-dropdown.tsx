"use client";

import { Ellipsis, Pause, Play, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFocusContext } from "../item-provider";

type Checked = DropdownMenuCheckboxItemProps["checked"];

export function WorkerDropdown() {
  const router = useRouter();
  const { componentId, workerId, focusItemMetadata, setFocusItem} = useFocusContext();
  const [recovery, setRecovery] = useState<Checked>(true);

  const handleDelete = async() => {
    await fetch("/api/workers", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        componentId,
        workerId
      }),
    }).then((resp) => {
      if (componentId && resp.ok){
        setFocusItem({ componentId, workerId: undefined })
      }
    })
  }
  
  const handleResume = async() => {
    const componentId = focusItemMetadata?.versionedComponentId.componentId;
    await fetch("/api/workers/resume", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        componentId,
        workerId
      }),
    })
    router.refresh();
  }

  const handleInterrupt = async() => {
    const componentId = focusItemMetadata?.versionedComponentId.componentId;
    await fetch("/api/workers/interrupt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        componentId,
        workerId,
        recovery
      }),
    })
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant={"outline"}
          className="absolute top-4 right-4 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground aspect-square h-auto w-auto p-1"
        >
          <Ellipsis className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        align="start"
      >
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Options
        </DropdownMenuLabel>
        <DropdownMenuItem className="gap-2 p-2" onClick={() => handleResume()}>
          <div className="flex size-6 items-center justify-center rounded-sm border">
            <Play className="size-4 shrink-0" />
          </div>
          {"Resume"}
          <DropdownMenuShortcut>⌘</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger onClick={() => handleInterrupt()}>
            <div className="flex size-6 items-center justify-center rounded-sm border">
              <Pause className="size-4 shrink-0" />
            </div>
            <span>{"Interrupt"}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuCheckboxItem
                checked={recovery}
                onSelect={(e) => {
                  e.preventDefault();
                  setRecovery(!recovery);
                }}
              >
                Recovery immediately?
              </DropdownMenuCheckboxItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuItem className="gap-2 p-2" onClick={() => handleDelete()}>
          <div className="flex size-6 items-center justify-center rounded-sm border">
            <X className="size-4 shrink-0" />
          </div>
          {"Delete"}
          <DropdownMenuShortcut>⌘</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
