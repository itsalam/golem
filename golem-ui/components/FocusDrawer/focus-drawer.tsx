"use client";

import { Component, ItemType } from "@/lib/types";
import { useRouter } from "next/navigation";
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
  focusItemId?: string;
  focusItemMetadata?: Component;
  focusItemType?: ItemType;
  path?: string[];
  setFocusItem: (
    item: string,
    itemType: ItemType,
    metaData?: Component
  ) => void;
};

export const FocusContext = createContext<FocusContext | null>(null);

export const FocusProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [focusItemId, setFocusItemId] = useState<string>();
  const [focusItemMetaData, setFocusItemMetaData] = useState<Component>();
  const [focusItemType, setFocusItemType] = useState<ItemType>();

  const setFocusItem = (id: string, type: ItemType, metaData?: Component) => {
    setFocusItemId(id);
    setFocusItemType(type);
    setFocusItemMetaData(metaData);
    if (type === ItemType.component) {
      const path = `/${ItemType.component}/${id.toLowerCase()}`;
      router.push(path);
    } else if (type === ItemType.worker) {
      const path = `/${
        ItemType.component
      }/${metaData?.versionedComponentId.componentId.toLowerCase()}/${
        ItemType.worker
      }/${id}`;
      router.push(path);
    }
  };

  const contextValue = useMemo<FocusContext>(
    () => ({
      focusItemId,
      focusItemMetaData,
      focusItemType,
      setFocusItem,
    }),
    [focusItemId, setFocusItemId]
  );

  return (
    <FocusContext.Provider value={contextValue}>
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

export const FocusDrawer = ({
  children,
  ...props
}: {
  children: ReactNode;
  itemType?: string;
  itemId?: string;
  itemMetaData?: Component;
}) => {
  const {
    focusItemMetadata = props.itemMetaData,
    focusItemId = props.itemId,
    focusItemType = props.itemType,
    setFocusItem,
  } = useFocusContext() || {};


  useEffect(() => {

    // focusItemId &&
    //   focusItemType &&
    //   focusItemMetadata &&
    //   setFocusItem(focusItemId, focusItemType as ItemType, focusItemMetadata);
  }, []);

  if (!focusItemId) {
    return null;
  }

  return (
    <div className="p-4 w-full h-full overflow-hidden border-t col-span-2 row-span-2 grid grid-cols-subgrid grid-rows-subgrid gap-0">
      {children}
    </div>
  );
};
