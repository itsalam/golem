"use client";

import { useFocusContext } from "@/components/FocusDrawer/focus-drawer";
import IconInput from "@/components/inputs/IconInput";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Component, ItemType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { ComponentProps, FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { LayoutSwitch } from "./LayoutSwitch";
import { ComponentCardProvider } from "./provider";

const ComponentCard: FC<
  ComponentProps<typeof Card> & { components: Component[] }
> = ({ className, components, ...props }) => {
  const {setFocusItem} = useFocusContext();
  return (
    <ComponentCardProvider>
      <Card className={cn("m-2 h-fit", className)}>
        <CardHeader>
          <CardTitle className="relative flex lg:flex-row flex-col justify-between gap-2">
            Components
            <div className="flex items-center gap-4 lg:gap-2">

              <IconInput />
              <div className="absolute lg:static top-0 right-0 flex items-center gap-2">
              <LayoutSwitch />
              <Button>
                <span className="hidden lg:block">{"New "}</span>
                <Plus />
              </Button>
              </div>
            </div>
          </CardTitle>

          {/* <CardDescription>Deploy your new project in one-click.</CardDescription> */}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Exports</TableHead>
                <TableHead className="text-right">Size</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {components?.map((component) => (
                <TableRow key={component.componentName} onClick={() => setFocusItem(component.versionedComponentId.componentId, ItemType.component, component)}>
                  <TableCell className="font-medium">
                    {component.componentName}
                  </TableCell>
                  <TableCell>
                    {Math.floor(component.versionedComponentId.version)}
                  </TableCell>
                  <TableCell>{component.componentType}</TableCell>
                  <TableCell>{component.metadata.exports.length}</TableCell>
                  <TableCell className="text-right">
                    {Math.floor(component.componentSize / 1024)}kb
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </ComponentCardProvider>
  );
};

export default ComponentCard;
