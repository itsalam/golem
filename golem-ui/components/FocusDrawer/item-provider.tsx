"use client";

import { Component, ItemType } from "@/lib/types";
import { redirect, RedirectType } from "next/navigation";
import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type FocusContext = {
  componentId?: string;
  workerId?: string;
  focusItemMetadata?: Component;
  path?: string[];
  setFocusItem: (item: {
    componentId?: string;
    workerId?: string;
    metadata?: Component;
  }) => void;
};

export const FocusContext = createContext<FocusContext | null>(null);

export const FocusProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [componentId, setComponentId] = useState<string>();
  const [workerId, setWorkerId] = useState<string>();

  console.log(componentId)
  const [focusItemMetadata, setFocusItemMetaData] = useState<Component>();

  const setFocusItem = (params: {
    componentId?: string;
    workerId?: string;
    metadata?: Component;
  }) => {
    const {
      componentId: newComponentId,
      workerId: newWorkerId,
      metadata,
    } = params;
    setFocusItemMetaData(metadata)
    let finalComponentId = componentId,
      finalWorkerId = workerId;
    if ("workerId" in params) {
      setWorkerId(newWorkerId);
      finalWorkerId = newWorkerId;
    }
    if ("componentId" in params) {
      setComponentId(newComponentId);
      finalComponentId = newComponentId;
    }
    console.log({
      finalComponentId,
      componentId,
      newComponentId,
      finalWorkerId,
    });
    if (finalComponentId) {
      const path = `/${ItemType.component}/${finalComponentId.toLowerCase()}${
        finalWorkerId ? `/${ItemType.worker}/${finalWorkerId}` : ""
      }`;
      redirect(path, RedirectType.replace);
    } else {
      redirect("/", RedirectType.replace);
    }

  };

  useEffect(() => console.log(componentId), [componentId])

  const context = useMemo(
    () => ({ componentId, workerId, focusItemMetadata, setFocusItem }),
    [componentId, workerId, focusItemMetadata, setFocusItem]
  );

  return (
    <FocusContext.Provider value={context}>{children}</FocusContext.Provider>
  );
};

export function useFocusContext() {
  const context = useContext(FocusContext);
  if (!context) {
    throw new Error(
      "useFocusContext must be used within a FocusDrawerProvider."
    );
  }

  return context;
}
