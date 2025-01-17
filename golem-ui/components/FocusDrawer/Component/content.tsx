import { fetchComponentVersions, fetchWorkersWithFilters } from "@/lib/client";
import { Component } from "@/lib/types";

import { DrawerHeader } from "@/components/ui/drawer";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Anchor, Boxes, Cpu, Feather, FileUp } from "lucide-react";
import { FC } from "react";
import { Badge } from "../../ui/badge";
import { Card, CardTitle } from "../../ui/card";
import { ExportTable } from "../exports-table/exports-table";
import { FocusProvider } from "../item-provider";
import MetricCard from "../metric-card";
import { SideColumn } from "../side-column";
import { WorkerSearchProvider } from "./search-provider";
import { WorkersDisplay } from "./worker-card";
import { WorkerHeader } from "./worker-header";

type DrawerProps = {
  componentId: string;
  itemMetaData?: Component;
};

export const DrawerContent: FC<DrawerProps> = async ({
  componentId,
  itemMetaData,
}) => {
    console.log({ componentId });
  const workers = await fetchWorkersWithFilters(componentId);
  const componentVersions: Component[] = await fetchComponentVersions(componentId);

  const ComponentTypeIcon = itemMetaData?.componentType === "Durable"? Anchor : Feather;

  return (
    <WorkerSearchProvider>
      <FocusProvider>
        <Card className="col-span-full row-span-full grid gap-0">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel
              className="h-auto flex flex-col"
              defaultSize={66}
            >
              <DrawerHeader className="flex-row justify-between h-36 pr-0">
                <div className="flex justify-center flex-col">
                  <CardTitle className="inline-flex items-center gap-2">
                    {itemMetaData?.componentName}{" "}
                  </CardTitle>
                  <div className="text-neutral-400 inline-flex items-center leading-none gap-2 py-1">
                    <Badge className="text-sm w-min leading-none py-1 px-1.5 font-mono tracking-wide">
                      v{itemMetaData?.versionedComponentId.version}
                    </Badge>
                    <h5 className="flex items-center gap-0.5">
                      <Boxes size={16} />
                      {"Component"}
                    </h5>
                  </div>
                </div>
                {itemMetaData && (
                  <div className="flex items-start flex-col justify-evenly border-l">
                    <div className="flex-1 flex border-b items-center w-full pl-3">
                      <ComponentTypeIcon className="h-5 w-5 text-neutral-600" />
                      <MetricCard
                        className="py-0"
                        titleContent={
                          <>
                            <p>Component Type</p>
                          </>
                        }
                      >
                        {itemMetaData.componentType}
                      </MetricCard>
                    </div>
                    <div className="flex-1 flex border-b items-center w-full pl-3">
                      <Cpu className="h-5 w-5 text-neutral-600" />
                      <MetricCard
                        className="py-0"
                        titleContent={
                          <>
                            <p>Component Size</p>
                          </>
                        }
                      >
                        {Math.floor(itemMetaData.componentSize / 1024)}KB
                      </MetricCard>
                    </div>
                    <div className="flex-1 flex items-center w-full pl-3">
                      <FileUp className="h-5 w-5 text-neutral-600" />
                      <MetricCard
                        className="py-0"
                        titleContent={
                          <>
                            <p>Exports</p>
                          </>
                        }
                      >
                        {itemMetaData.metadata.exports.map((v) => v.functions.length).reduce((p, v) => p+v, 0)}
                      </MetricCard>
                    </div>
                  </div>
                )}
              </DrawerHeader>

              <div className="bg-card grid row-span-1 col-span-1 row-start-2 overflow-y-auto relative">
                {itemMetaData?.metadata.exports.map((exp) => {
                  return <ExportTable exp={exp} key={exp.name} />;
                })}
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />

            <ResizablePanel className="min-w-min flex flex-col">
              <SideColumn
                className="px-0 justify-end gap-0"
                header={<WorkerHeader workers={workers} />}
              >
                <WorkersDisplay
                  intialWorkers={workers}
                  itemMetaData={itemMetaData}
                  componentId={componentId}
                  componentVersions={componentVersions}
                />
              </SideColumn>
            </ResizablePanel>
          </ResizablePanelGroup>
        </Card>
      </FocusProvider>
    </WorkerSearchProvider>
  );
};
