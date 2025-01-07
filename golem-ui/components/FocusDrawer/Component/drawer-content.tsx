import { GOLEM_ENDPOINT } from "@/lib/client";
import { Component, GolemWorker, WorkerStatus } from "@/lib/types";

import { Activity, AlertCircle, ChevronsRight, CircleX } from "lucide-react";
import { FC } from "react";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Card, CardHeader, CardTitle } from "../../ui/card";
import { ScrollArea } from "../../ui/scroll-area";
import { ExportTable } from "../exports-table/exports-table";
import MetricCard from "../metric-card";
import { SideColumn } from "../side-column";
import { WorkerCard } from "./worker-card";

type DrawerProps = {
  itemType: string;
  itemId: string;
  itemMetaData?: Component;
};

export const DrawerContent: FC<DrawerProps> = async ({
  itemId,
  itemType,
  itemMetaData,
}) => {
  const { workers }: { workers: GolemWorker[] } = await fetch(
    GOLEM_ENDPOINT + `/v1/components/${itemId}/workers`
  ).then((v) => v.json());

  const numIdle = workers.filter((w) =>
    [WorkerStatus.Idle].includes(w.status as WorkerStatus)
  ).length;
  const numRunning = workers.filter((w) =>
    [WorkerStatus.Running].includes(w.status as WorkerStatus)
  ).length;
  const numFailed = workers.filter((w) =>
    [WorkerStatus.Failed, WorkerStatus.Interrupted].includes(
      w.status as WorkerStatus
    )
  ).length;
  const numInProg = workers.filter((w) =>
    [WorkerStatus.Suspended, WorkerStatus.Retrying].includes(
      w.status as WorkerStatus
    )
  ).length;

  return (
    <Card className="col-span-full row-span-full grid grid-cols-subgrid grid-rows-subgrid gap-0">
      <div className="grid grid-cols-subgrid h-min border-b-2 col-span-1 row-span-1">
        <div className="flex justify-between">
          <CardHeader className="justify-center">
            <CardTitle className="inline-flex items-center gap-2">
              {itemMetaData?.componentName}{" "}
            </CardTitle>
            <Badge className="text-sm w-min leading-none py-1 px-1.5 font-mono tracking-wide">
              v{itemMetaData?.versionedComponentId.version}
            </Badge>
          </CardHeader>
          {itemMetaData && (
            <div className="p-4 md:p-6 text-sm flex flex-col gap-1">
              <p className="text-sm text-neutral-400">{itemType?.toString()}</p>
              <span>{itemMetaData.componentType}</span>
              <span>{Math.floor(itemMetaData.componentSize / 1024)}KB</span>
            </div>
          )}
        </div>
      </div>

      <SideColumn
        header={
          <>
            {" "}
            <h4 className="text-lg font-semibold flex gap-2">
              Workers<Button size={"sm"}>New +</Button>
            </h4>
            <div className="flex items-center">
              <MetricCard
                className="border-r pl-0"
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
                className="border-r"
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
                className="border-r"
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
                className="pr-0"
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
        }
      >
        <ScrollArea className="border-l">
          {workers.map((w) => {
            return <WorkerCard worker={w} itemMetaData={itemMetaData} />;
          })}
        </ScrollArea>
      </SideColumn>
      <div className="border-b z-10 bg-card grid row-span-1 col-span-1 row-start-2 overflow-y-auto relative">
        {itemMetaData?.metadata.exports.map((exp) => {
          return <ExportTable exp={exp} />;
        })}
      </div>
    </Card>
  );
};
