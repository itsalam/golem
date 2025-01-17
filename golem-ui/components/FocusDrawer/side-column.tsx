"use client";
import { Export, FunctionDetails } from "@/lib/types";
import { createZodSchema, getTypeFromParameters } from "@/lib/utils";
import { FC, ReactNode, useRef, useState } from "react";
import { APIForm } from "../ui/api-form";
import { DrawerHeader } from "../ui/drawer";
import { XButton } from "../ui/x-button";
import { useDrawer } from "./drawer-provider";
import { FormEntry } from "./exports-table/dynamic-form-entry";
import { useFocusContext } from "./item-provider";


type DrawerProps = {
  header: ReactNode;
  children: ReactNode;
  className?: string;
};

const InvokeColumn: FC<{ exp: Export; func: FunctionDetails }> = ({
  exp,
  func,
}) => {
  const { componentId, workerId, focusItemMetadata } = useFocusContext();
  const { setInvokeDetails } = useDrawer();
  const [formStateMap, setFormStateMap] = useState<Record<string, unknown>>({});
  const restoreFormState = (formKey: string) => {
    return formStateMap[formKey] || {}; // Return an empty object if no state exists for the form
  };
  const schema = createZodSchema(func.parameters);
  const currFormState = useRef<Schema | object>(null);
  type Schema = typeof schema;

  // const form = useForm<Schema>({
  //   resolver: zodResolver(schema),
  //   defaultValues: restoreFormState(func.name) || schema.parse({}), 
  // });

  // useEffect(() => {
  //   form.reset({});
  // }, [func.name, func.parameters]);

  // const values = form.watch();

  // useEffect(() => {
  //   const restoredState = restoreFormState(func.name);

  //   // Update current form state
  //   currFormState.current = restoredState;

  //   const repopulateState = (
  //     obj: Record<string, unknown>,
  //     prefix: string[] = []
  //   ) => {
  //     Object.keys(obj).forEach((key) => {
  //       const prefixes = [...prefix, key];
  //       if (typeof obj[key] === "object" && obj[key] !== null) {
  //         repopulateState(obj[key] as Record<string, unknown>, prefixes);
  //       } else {
  //         form.setValue(prefixes.join(".") as Path<Schema>, obj[key], {
  //           shouldValidate: false,
  //         });
  //       }
  //     });
  //   };
  //   repopulateState(restoredState as Record<string, unknown>);

  //   return () => {
  //     setFormStateMap((prev) => ({
  //       ...prev,
  //       [func.name]: currFormState.current,
  //     }));
  //     form.reset();
  //   };
  // }, [func]);

  // useEffect(() => {
  //   currFormState.current = values;
  // }, [values]);

  return (
    <>
      <DrawerHeader className="flex justify-between flex-row items-center">
        <div className="flex items-center gap-2">
          <div className="flex items-start flex-col relative">
            <div className="inline-flex items-end gap-1">
              <p className="text-sm text-neutral-600">
                {workerId
                  ? workerId
                  : "Creating New Worker"}
              </p>
            </div>
            <h5 className="font-semibold text-lg">{func.name}</h5>
            <p className="text-xs text-neutral-600">{exp.name}</p>
          </div>
        </div>

        <div className="flex flex-col justify-end gap-2 w-min items-end h-full pb-8 relative">
          <XButton
            className="absolute top-0 right-0 mt-4"
            onClick={() => setInvokeDetails()}
          />
        </div>
      </DrawerHeader>
      <APIForm<Schema>
        schema={schema}
        renderForm={(key, form, zod) => {
          return (
            <FormEntry<Schema>
              name={key}
              zod={zod}
              form={form}
              key={key}
              label={key}
              placeHolder={getTypeFromParameters(key, func.parameters)}
            />
          );
        }}
        submitHandler={async (paramsVal) => {
          return await fetch("/api/invoke", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              funcDetails: func,
              exportName: exp.name,
              componentId: focusItemMetadata?.versionedComponentId.componentId,
              workerId,
              params: paramsVal,
            }),
          })
        }}
      />
    </>
  );
};

export const SideColumn: FC<DrawerProps> = ({
  header,
  children,
  className,
}) => {
  const { invokeFunc, exp } = useDrawer();

  if (invokeFunc && exp) {
    return <InvokeColumn func={invokeFunc} exp={exp} />;
  }
  return (
    <>
      <DrawerHeader className={className}>{header}</DrawerHeader>
      <div className="flex flex-col overflow-auto">{children}</div>
    </>
  );
};
