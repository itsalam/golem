import { cn } from "@/lib/utils";
import { FC, ReactNode } from "react";

type MetricCardType = {
  titleContent?: ReactNode;
  children?: ReactNode;
  className?: string;
};

const MetricCard: FC<MetricCardType> = ({ titleContent, children, className }) => {
  return (
      <div className={cn("flex flex-col px-3 h-min", className)}>
        <div className="flex text-sm gap-2 items-center text-neutral-500 text-nowrap">
          {titleContent}
        </div>
        <div className="text-left text-lg font-semibold tracking-tight md:text-xl">{children}</div>
      </div>
  );
};

export default MetricCard;
