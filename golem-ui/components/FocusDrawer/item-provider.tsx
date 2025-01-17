"use client";

import { Component, ItemType } from "@/lib/types";
import { useRouter } from "next/navigation";
import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useState
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
  const router = useRouter();
  const [componentId, setComponentId] = useState<string>();
  const [workerId, setWorkerId] = useState<string>();

  const [focusItemMetadata, setFocusItemMetaData] = useState<Component>();

  const setFocusItem = (params: {
    componentId?: string;
    workerId?: string;
    metadata?: Component;
  }) => {
    const { componentId, workerId, metadata } = params;
    if ("workerId" in params) {
      setWorkerId(workerId);
    }
    if ("componentId" in params) {
      setComponentId(componentId);
    }
    if (componentId) {
      setComponentId(componentId);
      const path = `/${ItemType.component}/${componentId.toLowerCase()}${
        workerId ? `/${ItemType.worker}/${workerId}` : ""
      }`;
      router.push(path);
    } else {
      router.push("/");
    }

    setFocusItemMetaData(metadata);
  };

  return (
    <FocusContext.Provider
      value={{
        componentId,
        workerId,
        focusItemMetadata,
        setFocusItem,
      }}
    >
      {children}
    </FocusContext.Provider>
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
