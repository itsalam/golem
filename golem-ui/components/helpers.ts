import { WorkerStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Activity,
  AlertCircle,
  ChevronsRight,
  CircleX,
  LogOut,
  LucideIcon,
} from "lucide-react";

export const getStatusColor = (status: string) =>
  cn({
    "text-green-600": status === WorkerStatus.Running,
    "text-blue-600": status === WorkerStatus.Idle,
    "text-red-600":
      status === WorkerStatus.Failed || status === WorkerStatus.Interrupted,
    "text-yellow-600":
      status === WorkerStatus.Retrying || status === WorkerStatus.Suspended,
  });

export const getStatusIcon = (status: string) => {
  const WorkerStatusMap: Record<WorkerStatus, LucideIcon> = {
    [WorkerStatus.Running]: ChevronsRight,
    [WorkerStatus.Idle]: Activity,
    [WorkerStatus.Suspended]: AlertCircle,
    [WorkerStatus.Interrupted]: CircleX,
    [WorkerStatus.Retrying]: AlertCircle,
    [WorkerStatus.Failed]: CircleX,
    [WorkerStatus.Exited]: LogOut,
  };

  return WorkerStatusMap[status as WorkerStatus];
};
