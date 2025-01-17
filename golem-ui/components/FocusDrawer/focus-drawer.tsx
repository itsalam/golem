"use client";

import { Component } from "@/lib/types";
import { ReactNode, useEffect } from "react";
import { useFocusContext } from "./item-provider";

export const FocusDrawer = ({
  children,
  ...props
}: {
  children: ReactNode;
  componentId?: string;
  workerId?: string;
  itemMetaData?: Component;
}) => {
  const { componentId: pageComponentId, workerId: pageWorkerId, itemMetaData } = props;

  const {
    workerId,
    componentId,
    focusItemMetadata,
    setFocusItem,
  } = useFocusContext() || {};

  const finalItemId = (workerId ?? pageWorkerId) ??  (componentId ?? pageComponentId)

  useEffect(() => {
    if (!(workerId ?? componentId)) {
      setFocusItem({
        componentId: pageComponentId,
        workerId: pageWorkerId,
        metadata: itemMetaData,
      });
    }
  }, [finalItemId, focusItemMetadata, itemMetaData, setFocusItem]);


  if (!finalItemId) {
    return null;
  }

  return (
    <div className="w-full h-full overflow-hidden border-t col-span-2 row-span-2 grid grid-cols-subgrid grid-rows-subgrid gap-0">
      {children}
    </div>
  );
};
