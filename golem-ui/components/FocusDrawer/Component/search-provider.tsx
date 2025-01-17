"use client";

import {
  SortValues,
  StringComparison,
  WorkerSearchFields,
  WorkerStatus,
} from "@/lib/types";
import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import { DateRange } from "react-day-picker";

export enum VersionComparison {
  LESS_EQ = "<=",
  EQ = "=",
  GREATER_EQ = ">=",
}

type WorkerSearchContext = WorkerSearchFields & {
  openNewWorker: (b: boolean) => void;
  newWorker: boolean;
  setFields: (fields: Partial<WorkerSearchFields>) => void;
  isDescOrder: boolean;
  setDescOrder: (b: boolean) => void;
  setSortBy: (sortBy: SortValues) => void;
  sortBy?: SortValues;
};

export const WorkerSearchContext = createContext<WorkerSearchContext | null>(
  null
);

export const WorkerSearchProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [name, setName] = useState<string | undefined>(undefined);
  const [nameComparison, setNameComparison] = useState<
    keyof typeof StringComparison | undefined
  >(undefined);
  const [statuses, setStatuses] = useState<WorkerStatus[] | undefined>(
    undefined
  );
  const [version, setVersion] = useState<number | undefined>(undefined);
  const [versionComparison, setVersionComparison] = useState<
    VersionComparison | undefined
  >();
  const [dateRange, setDateRange] = useState<DateRange>();
  const [newWorker, openNewWorker] = useState<boolean>(false);
  const [isDescOrder, setDescOrder] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<SortValues>();

  const setFields = (fields: Partial<WorkerSearchFields>) => {
    if (fields.statuses !== undefined) setStatuses(fields.statuses);
    if (fields.version !== undefined) setVersion(fields.version);
    if (fields.versionComparison !== undefined)
      setVersionComparison(fields.versionComparison);
    if (fields.dateRange !== undefined) setDateRange(fields.dateRange);
    if (fields.name !== undefined) setName(fields.name);
    if (fields.nameComparison !== undefined)
      setNameComparison(fields.nameComparison);
  };

  const contextValue = useMemo<WorkerSearchContext>(
    () => ({
      setSortBy,
      sortBy,
      name,
      nameComparison,
      newWorker,
      openNewWorker,
      statuses,
      version,
      versionComparison,
      dateRange,
      setFields,
      isDescOrder,
      setDescOrder,
    }),
    [
      sortBy,
      name,
      nameComparison,
      newWorker,
      statuses,
      version,
      versionComparison,
      dateRange,
      isDescOrder,
    ]
  );

  return (
    <WorkerSearchContext.Provider value={contextValue}>
      {children}
    </WorkerSearchContext.Provider>
  );
};

export function useWorkerSearchContext() {
  const context = useContext(WorkerSearchContext);
  if (!context) {
    throw new Error(
      "useWorkerSearchContext must be used within a WorkerSearchContextProvider."
    );
  }

  return context;
}
