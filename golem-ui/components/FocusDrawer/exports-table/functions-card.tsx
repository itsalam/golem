"use client";

import {
    AccordionItem
} from "@/components/ui/accordion";
import { Export, FunctionDetails, Parameter, Result } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { FC, Fragment } from "react";
import { Badge } from "../../ui/badge";
import { useDrawer } from "../drawer-provider";
import { ExportType } from "./export-type";

const ParamsCell: FC<{ params: (Result | Parameter)[]; title: string }> = ({
  params,
  title,
}) => {
  
  return (
    <div className="flex flex-col">
      <p className="text-xs text-neutral-600">{title}</p>
      <div className="font-mono text-xs">
        {params.map((p, index) => (
          <Fragment key={index}>
            <span>
              <ExportType typeDefs={p.typ} name={p.name ?? undefined} />
            </span>
            {index < params.length - 1 && (
              <span>
                ,<br />
              </span>
            )}
          </Fragment>
        ))}
        {!params.length && !params.some((p) => p.name) && (
          <span className="text-neutral-400">{"{}"}</span>
        )}
      </div>
    </div>
  );
};

export const FunctionCard = ({
  func,
  exp,
}: {
  func: FunctionDetails;
  exp: Export;
}) => {
  const {setInvokeDetails, invokeFunc} = useDrawer();
//   const schema = createZodSchema(func.parameters[0])
//   const form = useForm<z.infer<typeof schema>>({
//     resolver: zodResolver(schema),
//   })
 
  // 2. Define a submit handler.
//   function onSubmit(values: z.infer<typeof schema>) {
//     // Do something with the form values.
//     // ✅ This will be type-safe and validated.
//     console.log(values)
//   }

//   const schemaKeys = Object.entries(schema.shape);

  return (
    <AccordionItem
      value={func.name}
      className={cn("grid col-span-5 grid-cols-subgrid row-span-2 rounded-lg border bg-card text-card-foreground shadow-sm p-4 items-center justify-start w-full hover:bg-neutral-50", invokeFunc?.name === func.name && "bg-neutral-100")}
      key={func.name}
    >
      <div
        className="flex-1 transition-all py-0 grid col-span-5 grid-cols-subgrid row-span-1 items-center gap-4 justify-start w-full text-left"
        key={func.name}
        onClick={() => setInvokeDetails(func, exp)}
      >
        <Badge className="font-mono text-xs w-min h-min hidden lg:block">API</Badge>
        <div className="flex flex-col px-0">
          <div className="font-light text-xs text-neutral-600">{exp.name}</div>
          <div className="font-medium lg:text-base text-sm">{func.name}</div>
        </div>

        <ParamsCell params={func.parameters} title={"Input Params"} />
        <ParamsCell params={func.results} title={"Output Params"} />
        <ChevronRight size={16} className="text-neutral-600 transition-all ml-auto"/>
      </div>
    </AccordionItem>
  );
};
