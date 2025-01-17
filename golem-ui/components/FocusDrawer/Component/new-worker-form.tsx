import { APIForm } from "@/components/ui/api-form";
import { Component } from "@/lib/types";
import { z } from "zod";
import { FormEntry } from "../exports-table/dynamic-form-entry";

export const NewWorkerForm = ({metadata} : {metadata: Component}) => {
  const schema = z.object({
    name: z.string(),
    args: z.array(z.string()).optional(),
    env: z.record(z.string()).optional(),
  });

  type Schema = typeof schema;

  const schemaKeys = Object.entries(schema.shape);

  console.log(schemaKeys);

  return (
      <APIForm<Schema>
        schema={schema}
        renderForm={(key, form, zod) => {
          return (
            <FormEntry<Schema> name={key} zod={zod} form={form} key={key} label={key} />
          );
        }}
        submitHandler={async (data) => {
          console.log(data)
          return await fetch("/api/workers", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...data,
              id: metadata.versionedComponentId.componentId
            }),
          })
        }}
      />
  );
};
