"use client";

import {
  Component,
  GolemWorker,
  SortValues,
  WorkerSearchFields
} from "@/lib/types";

import { getStatusColor, getStatusIcon } from "@/components/helpers";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, dateRangeToString } from "@/lib/utils";
import { Cpu, Rocket } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { Badge } from "../../ui/badge";
import { useFocusContext } from "../item-provider";
import { NewWorkerForm } from "./new-worker-form";
import { useWorkerSearchContext } from "./search-provider";
import { WorkerFilter } from "./worker-filter";

type WorkersDisplayProps = {
  intialWorkers: GolemWorker[];
  itemMetaData?: Component;
  componentVersions?: Component[]
  componentId: string;
};

type WorkerCardProps = {
  worker: GolemWorker;
  itemMetaData?: Component;
};

export const WorkersDisplay: FC<WorkersDisplayProps> = ({
  intialWorkers,
  itemMetaData,
  componentId,
  componentVersions
}) => {
  const [workers, setWorkers] = useState<GolemWorker[]>(intialWorkers);
  const { sortBy, isDescOrder, name, nameComparison, statuses, version, versionComparison, dateRange, newWorker } =
    useWorkerSearchContext();

  useEffect(() => {
    const fields: WorkerSearchFields = {
      name,
      nameComparison,
      statuses,
      version,
      versionComparison,
      ...(dateRange?.from && dateRange?.to ? { dateRange } : {}),
    };

    if (
      !itemMetaData?.versionedComponentId ||
      !Object.values(fields).find(Boolean)
    ) {
      return;
    }
    fetch(
      `/api/workers?componentId=${componentId}&fields=${encodeURIComponent(JSON.stringify(fields))}`
    )
      .then((v) => v.json())
      .then((json) => {
        setWorkers(json.workers);
      });
  }, [
    name,
    nameComparison,
    statuses,
    version,
    versionComparison,
    dateRange,
    itemMetaData?.versionedComponentId,
  ]);

  useEffect(() => {
    let currWorkers = workers;
    if (sortBy === SortValues.Date){
      currWorkers = workers.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === SortValues.Name) {
      currWorkers = workers.sort((a, b) => a.workerId.workerName.localeCompare(b.workerId.workerName));
    } else if (sortBy === SortValues.Version) {
      currWorkers = workers.sort((a, b) => a.componentVersion - (b.componentVersion));
    } 

    if(!isDescOrder && sortBy) {
      currWorkers = currWorkers.reverse();
    }

    setWorkers(currWorkers)
    
  }, [sortBy, isDescOrder, workers])

  if (newWorker && itemMetaData) {
    return <NewWorkerForm metadata={itemMetaData} />
  }

  return (
    <>
    <WorkerFilter itemId={componentId} componentVersions={componentVersions} />
    <ScrollArea>
      {workers.map((w) => {
        return (
          <WorkerCard
            worker={w}
            itemMetaData={itemMetaData}
            key={w.workerId.workerName}
          />
        );
      })}
    </ScrollArea>
    </>
  );
};

export const WorkerCard: FC<WorkerCardProps> = ({ worker, itemMetaData }) => {
  const { setFocusItem } = useFocusContext();

  return (
    <div
      className="p-4 border-b hover:bg-slate-50"
      onClick={() =>
        setFocusItem({workerId:worker.workerId.workerName, metadata:itemMetaData})
      }
    >
      <div className="flex flex-col">
        <div className="flex justify-between">
          <h5 className="font-semibold text-sm">{worker.workerId.workerName} </h5>
          <span
            className={cn("text-sm inline-flex items-center gap-2", getStatusColor(worker.status))}
          >
            {worker.status}
            {(() => {
              const Icon = getStatusIcon(worker.status);
              return <Icon size={16}/>;
            })()}
          </span>
        </div>
        <div className="flex justify-between">
          <h5 className="text-sm text-neutral-600">
            {dateRangeToString(new Date(worker.createdAt), new Date())}
          </h5>

          <span
            className={cn(
              "text-sm text-neutral-600 inline-flex items-center gap-2",
            )}
          >
            {Math.floor(worker.componentSize / 1024)}KB
          </span>
        </div>
        <div className="w-full flex justify-between gap-1 pt-2">
          <div className="flex gap-2 text-gray-400 text-sm">
            <div className="flex items-center gap-1">
              {worker.pendingInvocationCount}
              <Rocket size={16} />
            </div>
            <div className="flex items-center gap-1">
              {Object.keys(worker.ownedResources).length}
              <Cpu size={16} />
            </div>
          </div>
          <div className="w-full flex justify-end gap-2">
            <Badge className="font-mono text-xs font-extralight">
              Args {worker.args.length}
            </Badge>
            <Badge className="font-mono text-xs font-extralight">
              v{worker.componentVersion}
            </Badge>
            <Badge className="font-mono text-xs font-extralight">
              Env {Object.keys(worker.env).length}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};
