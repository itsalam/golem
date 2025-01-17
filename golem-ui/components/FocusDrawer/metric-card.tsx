import { cn } from "@/lib/utils";
import { FC, ReactNode } from "react";

type MetricCardType = {
  titleContent?: ReactNode;
  children?: ReactNode;
  className?: string;
};

const MetricCard: FC<MetricCardType> = ({ titleContent, children, className }) => {
  return (
      <div className={cn("flex flex-col p-1 pt-2 px-3 h-min gap-0.5 justify-center", className)}>
        <div className="flex text-xs gap-2 items-center text-neutral-600 text-nowrap !leading-none">
          {titleContent}
        </div>
        <div className="text-left text-md font-semibold tracking-tight md:text-lg !leading-none">{children}</div>
      </div>
  );
};

export default MetricCard;
