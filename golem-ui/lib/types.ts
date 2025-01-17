import { DateRange } from "react-day-picker";

// Main Component Type
export type Component = {
  componentName: string;
  componentSize: number;
  componentType: string;
  createdAt: string; // ISO date string
  files: any[]; // Define specific file type if needed
  installedPlugins: any[]; // Define specific plugin type if needed
  metadata: Metadata;
  versionedComponentId: VersionedComponentId;
};

// Metadata Type
export type Metadata = {
  exports: Export[];
  memories: Memory[];
  producers: Producer[];
};

// Export Type
export type Export = {
  functions: FunctionDetails[];
  name: string;
  type: string;
};

// Function Details Type
export type FunctionDetails = {
  name: string;
  parameters: Parameter[];
  results: Result[];
};

// Parameter Type
export type Parameter = {
  name: string;
  typ: TypeDefinition;
};

// Result Type
export type Result = {
  name: string | null;
  typ: TypeDefinition;
};

// Type Definition Type
export type TypeDefinition = {
  type: string;
  fields?: Field[]; // For Record types
  cases?: Case[]; // For Variant types
  inner?: TypeDefinition; // For List types
};

// Field Type
export type Field = {
  name: string;
  typ: TypeDefinition;
};

// Case Type
export type Case = {
  name: string;
  typ: TypeDefinition;
};

// Memory Type
export type Memory = {
  initial: number;
  maximum: number | null;
};

// Producer Type
export type Producer = {
  fields: ProducerField[];
};

// Producer Field Type
export type ProducerField = {
  name: string;
  values: ProducerValue[];
};

// Producer Value Type
export type ProducerValue = {
  name: string;
  version: string;
};

// Versioned Component ID Type
export type VersionedComponentId = {
  componentId: string;
  version: number;
};

export type GolemWorker = {
  activePlugins: any[]; // Adjust type if specific structure is known
  args: any[]; // Adjust type if specific structure is known
  componentSize: number;
  componentVersion: number;
  createdAt: string; // ISO 8601 date string
  env: Record<string, unknown>; // Key-value pairs, adjust type as necessary
  lastError: null | string; // Null or string, depending on potential error messages
  ownedResources: Record<string, unknown>; // Key-value pairs, adjust type as necessary
  pendingInvocationCount: number;
  retryCount: number;
  status: WorkerStatus | string; // Adjust to include other potential statuses
  totalLinearMemorySize: number;
  updates: any[]; // Adjust type if specific structure is known
  workerId: {
    componentId: string;
    workerName: string;
  };
};

export enum ItemType {
  worker = "worker",
  component = "component",
  API = "api",
}

export enum WorkerStatus {
  Running = "Running",
  Idle = "Idle",
  Suspended = "Suspended",
  Interrupted = "Interrupted",
  Retrying = "Retrying",
  Failed = "Failed",
  Exited = "Exited",
}

export enum WitTypes {
  str = "str",
  Record = "record", // Fields become properties
  Variant = "variant",
  enum = "union of string literals",
  "option<T>" = "T | null", // If T can be represented as null
  List = "list",
  flags = "interface", // Each flag becomes an optional boolean property
  resource = "class", // Methods become class methods
}

export enum VersionComparison {
  LESS_EQ = "<=",
  EQ = "=",
  GREATER_EQ = ">=",
}

export const StringComparison: Record<string, string> = {
  "==": "==",
  "!=": "!=",
  like: "≈≈",
  notlike: "!≈≈",
};

export enum SortValues {
  Name = "name",
  Date = "date",
  Version = "version",
}

export type WorkerSearchFields = {
  name?: string;
  nameComparison?: keyof typeof StringComparison;
  statuses?: WorkerStatus[];
  version?: number;
  versionComparison?: VersionComparison;
  dateRange?: DateRange;
};
