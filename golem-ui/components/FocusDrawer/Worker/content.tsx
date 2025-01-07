import { GOLEM_ENDPOINT } from "@/lib/client";
import { Component, GolemWorker, WorkerStatus } from "@/lib/types";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  Activity,
  AlertCircle,
  ChevronsRight,
  CircleX,
  Cpu,
  Gauge,
  LogOut,
  LucideIcon,
} from "lucide-react";
import { FC } from "react";
import { Badge } from "../../ui/badge";
import { Card, CardHeader, CardTitle, SideCardHeader } from "../../ui/card";
import { ExportTable } from "../exports-table/exports-table";
import MetricCard from "../metric-card";
import { SideColumn } from "../side-column";
import { EnvVarsCard } from "./exports-card";

type DrawerProps = {
  componentId: string;
  itemType: string;
  workerId: string;
  itemMetaData?: Component;
};

export const DrawerContent: FC<DrawerProps> = async ({
  componentId,
  workerId,
  itemType,
  itemMetaData: componentMetadata,
}) => {
  const {
    args,
    env,
    status,
    workerId: workerIdObj,
    componentVersion,
    totalLinearMemorySize,
    ...metadata
  }: GolemWorker = await fetch(
    GOLEM_ENDPOINT + `/v1/components/${componentId}/workers/${workerId}`
  ).then((v) => v.json());

  const WorkerStatusMap: Record<WorkerStatus, LucideIcon> = {
    [WorkerStatus.Running]: ChevronsRight,
    [WorkerStatus.Idle]: Activity,
    [WorkerStatus.Suspended]: AlertCircle,
    [WorkerStatus.Interrupted]: CircleX,
    [WorkerStatus.Retrying]: AlertCircle,
    [WorkerStatus.Failed]: CircleX,
    [WorkerStatus.Exited]: LogOut,
  };

  const StatusIcon = WorkerStatusMap[status as WorkerStatus];

  const MainContent = () => (
    <div className="row-start-2 w-full h-full overflow-auto">
      {componentMetadata?.metadata.exports.map((exp) => {
        return <ExportTable exp={exp} />;
      })}
    </div>
  );

  const SideContent = () => (
    <SideColumn
      header={<EnvVarsCard workerEnv={env} itemMetaData={componentMetadata} />}
    >
      <div className="bg-card border-b text-sm p-4 overflow-auto">
        {Object.keys(args).length === 0 ? (
          <p className="text-neutral-500 text-sm text-center">
            {" "}
            No environment varibles have been set.
          </p>
        ) : (
          <Table className="flex-1">
            <TableBody>
              {Object.entries(env).map(([key, value]) => {
                return (
                  <TableRow key={key}>
                    <TableCell className="font-medium">{key}</TableCell>
                    <TableCell>{JSON.stringify(value)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      <SideCardHeader>
        <h4 className="text-lg font-semibold flex gap-2">Files</h4>
        <div className="flex items-center">
          <MetricCard className="border-r pl-0"></MetricCard>
        </div>
      </SideCardHeader>
      <div className="bg-card border-b text-sm p-4 overflow-auto">
        {!componentMetadata ||
        Object.keys(componentMetadata.files).length === 0 ? (
          <p className="text-neutral-500 text-sm text-center">
            No Files have been added.
          </p>
        ) : (
          <Table className="flex-1">
            <TableBody>
              {Object.entries(env).map(([key, value]) => {
                return (
                  <TableRow key={key}>
                    <TableCell className="font-medium">{key}</TableCell>
                    <TableCell>{JSON.stringify(value)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      <SideCardHeader>
        <h4 className="text-lg font-semibold flex gap-2">Metadata</h4>
        <div className="flex items-center">
          <MetricCard className="border-r pl-0"></MetricCard>
        </div>
      </SideCardHeader>
      <Table
        containerClassName="py-4 bg-card border-b"
        className="flex-1 border-b text-sm"
      >
        <TableBody>
          {Object.entries(metadata).map(([key, value]) => {
            return (
              <TableRow key={key} className="border-transparent">
                <TableCell className="font-medium w-min py-1 text-right">
                  {key}
                </TableCell>
                <TableCell className="py-1 font-mono text-xs">
                  {JSON.stringify(value)}
                </TableCell>
              </TableRow>
            );
          })}
          {Object.entries(metadata).map(([key, value]) => {
            return (
              <TableRow key={key} className="border-transparent">
                <TableCell className="font-medium w-min py-1 text-right">
                  {key}
                </TableCell>
                <TableCell className="py-1 font-mono text-xs">
                  {JSON.stringify(value)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </SideColumn>
  );

  return (
    <Card className="col-span-2 row-span-full grid grid-cols-subgrid grid-rows-subgrid">
      <div className="grid grid-cols-subgrid row-span-1 grid-rows-subgrid col-span-1 h-min border-b-2">
        <div className="flex justify-between">
          <CardHeader className="justify-center">
            <CardTitle className="inline-flex items-center gap-2">
              {workerIdObj.workerName}
            </CardTitle>
            <Badge className="text-sm w-min leading-none py-1 px-1.5 font-mono tracking-wide">
              v{componentVersion}
            </Badge>
          </CardHeader>
          <div className="flex items-center">
            <MetricCard
              className="border-r pl-0"
              titleContent={
                <>
                  <p>Status</p>
                </>
              }
            >
              <div className="flex items-center gap-1">
                {status}
                {
                  <StatusIcon
                    className={cn("h-4 w-4 ", {
                      "text-green-600": status === WorkerStatus.Running,
                      "text-blue-600": status === WorkerStatus.Idle,
                      "text-red-600":
                        status === WorkerStatus.Failed ||
                        status === WorkerStatus.Interrupted,
                      "text-yellow-600":
                        status === WorkerStatus.Retrying ||
                        status === WorkerStatus.Suspended,
                    })}
                  />
                }
              </div>
            </MetricCard>
            <MetricCard
              className="border-r"
              titleContent={
                <>
                  <p>Memory Usage</p>
                  <Gauge className="h-4 w-4 text-neutral-600" />
                </>
              }
            >
              {Math.floor(totalLinearMemorySize / Math.pow(1024, 2))}MB
            </MetricCard>
            <MetricCard
              titleContent={
                <>
                  <p>Resources</p>
                  <Cpu className="h-4 w-4 text-neutral-600" />
                </>
              }
            >
              {0}
            </MetricCard>
          </div>
        </div>
      </div>
      <MainContent />
      <SideContent />
    </Card>
  );
};
