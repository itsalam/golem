import {
  Export
} from "@/lib/types";

import { Accordion } from "@/components/ui/accordion";
import { FC } from "react";
import { FunctionCard } from "./functions-card";

type ExportTableProps = {
  exp: Export;
};

export const ExportTable: FC<ExportTableProps> = async ({ exp }) => {

  return (
    <div className="sticky top-0">
      <div className="p-2 bg-neutral-50">
        <Accordion type="single" collapsible className="grid grid-flow-dense grid-cols-[min-content_max-content_max-content_max-content] auto-cols-auto gap-y-4 mr-2 ">
            {exp.functions.map((func) => (
              <FunctionCard func={func} key={func.name} exp={exp}/>
            ))}
        </Accordion>

      </div>
    </div>
  );
};
