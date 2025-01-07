"use client";

import { Export, FunctionDetails, ItemType } from "@/lib/types";
import { createZodSchema, getTypeFromParameters } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AccordionItem } from "@radix-ui/react-accordion";
import { FC, ReactNode, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z, ZodTypeAny } from "zod";
import { Accordion, AccordionContent, AccordionTrigger } from "../ui/accordion";
import { Button } from "../ui/button";
import { Card, SideCardHeader } from "../ui/card";
import { Code } from "../ui/codeblock";
import { Form } from "../ui/form";
import { Switch } from "../ui/switch";
import { useDrawer } from "./drawer-provider";
import { FormEntry } from "./exports-table/dynamic-form-entry";
import { useFocusContext } from "./focus-drawer";

type DrawerProps = {
  header: ReactNode;
  children: ReactNode;
};

const InvokeColumn: FC<{ exp: Export; func: FunctionDetails }> = ({
  exp,
  func,
}) => {
  const { focusItemType, focusItemId } = useFocusContext();
  const [formStateMap, setFormStateMap] = useState<Record<string, any>>({});
  const restoreFormState = (formKey: string) => {
    return formStateMap[formKey] || {}; // Return an empty object if no state exists for the form
  };
  const schema = createZodSchema(func.parameters);
  const currFormState = useRef<{
    [x: string]: any;
  }>(null);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: restoreFormState(func.name), // Use restored state or empty if none
  });

  function onSubmit(values: z.infer<typeof schema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  const schemaKeys = Object.entries(schema.shape);

  const values = form.watch();

  useEffect(() => {
    const restoredState = restoreFormState(func.name);

    // Update current form state
    currFormState.current = restoredState;

    const repopulateState = (
      obj: Record<string, unknown>,
      prefix: string[] = []
    ) => {
      Object.keys(obj).forEach((key) => {
        const prefixes = [...prefix, key];
        if (typeof obj[key] === "object" && obj[key] !== null) {
          console.log(prefixes, obj[key]);
          repopulateState(obj[key] as Record<string, unknown>, prefixes);
        } else {
          form.setValue(prefixes.join("."), obj[key], {
            shouldValidate: false,
          });
          console.log(prefixes.join("."), obj[key]);
        }
      });
    };

    repopulateState(restoredState);

    return () => {
      setFormStateMap((prev) => ({
        ...prev,
        [func.name]: currFormState.current,
      }));
      form.reset();
    };
  }, [func]);

  useEffect(() => {
    currFormState.current = values;
  }, [values]);

  return (
    <div className="grid grid-cols-subgrid grid-rows-subgrid col-span-1 row-span-2 border-l col-start-2">
      <SideCardHeader>
        <div className="flex justify-between flex-row items-center">
          <div className="flex items-start flex-col">
            <p className="text-sm text-neutral-500">
              {focusItemType === ItemType.worker
                ? `Worker: ${focusItemId}`
                : "Creating New Worker"}
            </p>
            <h5 className="font-semibold text-lg">{func.name}</h5>
            <p className="text-xs text-neutral-500">{exp.name}</p>
          </div>
          <div className="flex flex-col justify-end gap-2 w-min items-end">
            <div className="text-sm flex text-nowrap gap-2">Preview Types <Switch></Switch></div>
            <Button size={"sm"} className="w-min">Invoke</Button>
          </div>
        </div>
      </SideCardHeader>
      <Accordion type="multiple" className="border-l flex flex-col p-2 gap-4 text-sm overflow-auto">
        <Card>
          <AccordionItem value="form">
              <AccordionTrigger className="flex justify-between p-4 border w-full text-bold text-large">
                Input
              </AccordionTrigger>
              <AccordionContent className="p-2">
                <Form {...form}>
                  {schemaKeys.map(([key, zodtype]) => {
                    return (
                      <FormEntry
                        name={key}
                        zod={zodtype as ZodTypeAny}
                        form={form}
                        key={key}
                        label={key}
                        placeHolder={getTypeFromParameters(
                          key,
                          func.parameters
                        )}
                      />
                    );
                  })}
                </Form>
              </AccordionContent>
          </AccordionItem>
          </Card>

            <Card>
            <AccordionItem value="preview">
              <AccordionTrigger className="flex justify-between p-4 border w-full text-bold text-large">
                Preview
              </AccordionTrigger>
              <AccordionContent>
                <Code code={JSON.stringify(form.getValues(), null, 2)} />
              </AccordionContent>
              </AccordionItem>
            </Card>
            

      </Accordion>
    </div>
  );
};

export const SideColumn: FC<DrawerProps> = ({ header, children }) => {
  const { invokeFunc, exp } = useDrawer();

  if (invokeFunc && exp) {
    return <InvokeColumn func={invokeFunc} exp={exp} />;
  }
  return (
    <div className="grid grid-cols-subgrid grid-rows-subgrid col-span-1 row-span-2 border-l col-start-2">
      <SideCardHeader>{header}</SideCardHeader>
      <div className="border-l flex flex-col">{children}</div>
    </div>
  );
};
