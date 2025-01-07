"use client"

import {
    Component,
    GolemWorker,
    ItemType,
    WorkerStatus
} from "@/lib/types";

import { cn, dateRangeToString } from "@/lib/utils";
import { Activity, Cpu, Rocket } from "lucide-react";
import { FC } from "react";
import { Badge } from "../../ui/badge";
import { useFocusContext } from "../focus-drawer";

type WorkerCardProps = {
  worker: GolemWorker;
  itemMetaData?: Component;
};

export const WorkerCard: FC<WorkerCardProps> = ({
  worker,
  itemMetaData,
}) => {
    const {setFocusItem} = useFocusContext();

    return (
        <div className="p-4 border-b hover:bg-slate-50" onClick={() => setFocusItem(worker.workerId.workerName, ItemType.worker, itemMetaData)}>
        <div className="flex flex-col">
            <div className="flex justify-between">
            <h5 className="font-semibold">{worker.workerId.workerName} </h5>
            <span
                className={cn("text-sm inline-flex items-center gap-2", {
                "text-blue-500": worker.status === WorkerStatus.Idle,
                })}
            >
                {worker.status}
                {worker.status === WorkerStatus.Idle ? (
                <Activity size={16} />
                ) : null}
            </span>
            </div>
            <div className="flex justify-between">
            <h5 className="text-sm text-neutral-500">
                {dateRangeToString(new Date(worker.createdAt), new Date())}
            </h5>

            <span
                className={cn(
                "text-sm text-neutral-500 inline-flex items-center gap-2",
                {
                    // "text-blue-500": worker.status === WorkerStatus.Idle,
                }
                )}
            >
                {Math.floor(worker.componentSize / 1024)}KB
            </span>

            </div>
            <div className="w-full flex justify-between gap-1 pt-2">
            <div className="flex gap-2 text-gray-400 text-sm">
            <div className="flex items-center gap-1">{worker.pendingInvocationCount}<Rocket size={16}/></div>
            <div className="flex items-center gap-1">{Object.keys(worker.ownedResources).length}<Cpu size={16}/></div>
            </div>
            <div className="w-full flex justify-end gap-1">
                <Badge className="font-mono text-xs font-extralight">Args {worker.args.length}</Badge>
                <Badge className="font-mono text-xs font-extralight">v{worker.componentVersion}</Badge>
                <Badge className="font-mono text-xs font-extralight">Env {Object.keys(worker.env).length}</Badge>

            </div>
            </div>

        </div>
        </div>
    );
          
};
