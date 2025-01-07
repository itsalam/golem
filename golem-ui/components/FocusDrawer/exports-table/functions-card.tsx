"use client";

import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Export, FunctionDetails, Parameter, Result } from "@/lib/types";
import { FC, Fragment } from "react";
import { Badge } from "../../ui/badge";
import { useDrawer } from "../drawer-provider";
import { ExportType } from "./export-type";

type ExportTableProps = {
  exp: Export;
};

const ParamsCell: FC<{ params: (Result | Parameter)[]; title: string }> = ({
  params,
  title,
}) => {
  
  return (
    <div className="flex flex-col">
      <p className="text-xs text-neutral-500">{title}</p>
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
          <span className="text-neutral-300">{"{}"}</span>
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
  const context = useDrawer();
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
      className="grid col-span-5 grid-cols-subgrid row-span-2 rounded-lg border bg-card text-card-foreground shadow-sm p-4 items-center justify-start w-full"
      key={func.name}
    >
      <AccordionTrigger
        className="py-0 grid col-span-5 grid-cols-subgrid row-span-1 items-center gap-4 justify-start w-full text-left"
        key={func.name}
        onClick={() => context.setInvokeDetails(func, exp)}
      >
        <Badge className="font-mono text-xs w-min h-min">API</Badge>
        <div className="flex flex-col px-0">
          <div className="font-light text-xs text-neutral-500">{exp.name}</div>
          <div className="font-medium">{func.name}</div>
        </div>

        <ParamsCell params={func.parameters} title={"Input Params"} />
        <ParamsCell params={func.results} title={"Output Params"} />
      </AccordionTrigger>
      <AccordionContent containerClassName="col-span-full hidden"
      className="grid auto-rows-auto grid-cols-2 gap-4 p-4">
        {/* <Form {...form}>
          
          {schemaKeys.map(([key, zodtype]) => {
            return <FormEntry name={key} zod={zodtype as ZodTypeAny} form={form} key={key} placeHolder={getTypeFromParameterName(key, func.parameters[0])}/>
          })}
        </Form> */}
      </AccordionContent>
    </AccordionItem>
  );
};
