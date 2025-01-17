import { GOLEM_ENDPOINT } from "@/lib/client";
import { Component, GolemWorker } from "@/lib/types";

import { getStatusColor, getStatusIcon } from "@/components/helpers";
import { DrawerHeader } from "@/components/ui/drawer";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  Gauge,
  MemoryStick,
  Pickaxe
} from "lucide-react";
import { FC } from "react";
import { Badge } from "../../ui/badge";
import { Card, CardTitle } from "../../ui/card";
import { BackButton } from "../BackButton";
import { ExportTable } from "../exports-table/exports-table";
import MetricCard from "../metric-card";
import { SideColumn } from "../side-column";
import { EnvVarsCard } from "./exports-card";
import { WorkerDropdown } from "./worker-dropdown";

type DrawerProps = {
  componentId: string;
  itemType: string;
  workerId: string;
  itemMetaData?: Component;
};

export const DrawerContent: FC<DrawerProps> = async ({
  componentId,
  workerId,
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

  const StatusIcon = getStatusIcon(status);

  const MainContent = () => (
    <div className="row-start-2 w-full h-full overflow-auto">
      {componentMetadata?.metadata.exports.map((exp) => {
        return <ExportTable exp={exp} key={exp.name} />;
      })}
    </div>
  );

  const SideContent = () => (
    <SideColumn
      header={<EnvVarsCard workerEnv={env} itemMetaData={componentMetadata} />}
    >
      <div className="bg-card border-b text-sm p-4 overflow-auto">
        {Object.keys(args).length === 0 ? (
          <p className="text-neutral-600 text-sm text-center">
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

      <DrawerHeader isSubHeader>
        <h4 className="text-lg font-semibold flex gap-2 py-4">Files</h4>
      </DrawerHeader>
      <div className="bg-card border-b text-sm p-4 overflow-auto">
        {!componentMetadata ||
        Object.keys(componentMetadata.files).length === 0 ? (
          <p className="text-neutral-600 text-sm text-center">
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

      <DrawerHeader isSubHeader>
        <h4 className="text-lg font-semibold flex gap-2 py-4">Metadata</h4>
      </DrawerHeader>
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
    <Card className="col-span-full row-span-full grid gap-0">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          className="h-auto border-b-2 flex flex-col"
          defaultSize={66}
        >
          <DrawerHeader className="flex-row justify-between h-36 pr-0">
            <div className="flex flex-col justify-center flex-1 relative">
            <WorkerDropdown/>
              <BackButton
                className="left-6 top-2"
                componentId={componentId}
                componentName={componentMetadata?.componentName}
              />
              <CardTitle className="inline-flex items-center gap-2">
                {workerIdObj.workerName}
              </CardTitle>

              <div className="text-neutral-400 inline-flex items-center leading-none gap-2 py-1">
                <Badge className="text-sm w-min leading-none py-1 px-1.5 font-mono tracking-wide">
                  v{componentVersion}
                </Badge>
                <h5 className="flex items-center gap-0.5">
                  <Pickaxe size={16} />
                {"Worker"}
                </h5>
              </div>
            </div>
            <div className="flex items-start flex-col justify-evenly border-l">
              <div className={cn("flex-1 flex items-center border-b w-full pl-3", getStatusColor(status))}>
                <StatusIcon
                  className={cn(
                    "h-4 w-4"
                  )}
                />
                <MetricCard
                  className="py-0"
                  titleContent={
                    <>
                      <p className="text-[unset]">Status</p>
                    </>
                  }
                >
                  <div className="flex items-center gap-1">{status}</div>
                </MetricCard>
              </div>
              <div className="flex-1 flex border-b items-center w-full pl-3">
                <Gauge className="h-4 w-4 text-neutral-600" />
                <MetricCard
                  className="py-0"
                  titleContent={
                    <>
                      <p>Memory Usage</p>
                    </>
                  }
                >
                  {Math.floor(totalLinearMemorySize / Math.pow(1024, 2))}MB
                </MetricCard>
              </div>
              <div className="flex-1 flex items-center w-full pl-3">
                <MemoryStick className="h-4 w-4 text-neutral-600" />
                <MetricCard
                  className="py-0"
                  titleContent={
                    <>
                      <p>Resources</p>
                    </>
                  }
                >
                  {0}
                </MetricCard>
              </div>
            </div>
          </DrawerHeader>
          <MainContent />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel className="min-w-min flex flex-col">
          <SideContent />
        </ResizablePanel>
      </ResizablePanelGroup>
    </Card>
  );
};
