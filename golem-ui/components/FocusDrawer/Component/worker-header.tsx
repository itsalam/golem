"use client";

import { GolemWorker, WorkerStatus } from "@/lib/types";

import { XButton } from "@/components/ui/x-button";
import {
  Activity,
  AlertCircle,
  ChevronsRight,
  CircleX,
  Plus
} from "lucide-react";
import { FC } from "react";
import { Button } from "../../ui/button";
import MetricCard from "../metric-card";
import { useWorkerSearchContext } from "./search-provider";

type DrawerProps = {
  workers: GolemWorker[];
};

export const WorkerHeader: FC<DrawerProps> = ({ workers }) => {
  const { openNewWorker, newWorker } = useWorkerSearchContext();

  const numIdle = workers.filter((w) =>
    [WorkerStatus.Idle].includes(w.status as WorkerStatus)).length;
  const numRunning = workers.filter((w) =>
    [WorkerStatus.Running].includes(w.status as WorkerStatus)).length;
  const numFailed = workers.filter((w) =>
    [WorkerStatus.Failed, WorkerStatus.Interrupted].includes(
      w.status as WorkerStatus
    )).length;
  const numInProg = workers.filter((w) =>
    [WorkerStatus.Suspended, WorkerStatus.Retrying].includes(
      w.status as WorkerStatus
    )).length;

  return (
    <>
      <div className="text-lg font-semibold flex gap-2 px-6 h-full justify-between">
        <h4 className="self-center">Workers</h4>
        {newWorker ? (
          <XButton
            className="mt-4"
            onClick={() => openNewWorker(false)}
          />
        ) : (
          <Button
            className="mb-auto my-4"
            variant={"outline"}
            size={"sm"}
            onClick={() => openNewWorker(true)}
          >
            New <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex border-t">
        <MetricCard
          className="border-r flex-1"
          titleContent={
            <>
              <p>Active</p>
              <Activity className="h-4 w-4 text-blue-600" />
            </>
          }
        >
          {numIdle}
        </MetricCard>
        <MetricCard
          className="border-r flex-1"
          titleContent={
            <>
              <p>Running</p>
              <ChevronsRight className="h-4 w-4 text-green-600" />
            </>
          }
        >
          {numRunning}
        </MetricCard>
        <MetricCard
          className="border-r flex-1"
          titleContent={
            <>
              <p>Failed</p>
              <CircleX className="h-4 w-4 text-red-600" />
            </>
          }
        >
          {numFailed}
        </MetricCard>
        <MetricCard
          className="flex-1"
          titleContent={
            <>
              <p>In Progress</p>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </>
          }
        >
          {numInProg}
        </MetricCard>
      </div>
    </>
  );
};
