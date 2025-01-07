"use client";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ComponentProps, FC, HTMLInputTypeAttribute } from "react";
import {
    ControllerRenderProps,
    FieldValues,
    UseFormReturn,
} from "react-hook-form";
import {
    AnyZodObject,
    ZodBoolean,
    ZodNumber,
    ZodObject,
    ZodString,
    ZodTypeAny,
} from "zod";

type Field = ControllerRenderProps<FieldValues, string>;

const BasicForm: FC<{ field: Field; placeholder?: string, type?: HTMLInputTypeAttribute }> = ({
  field,
  placeholder,
  type,
}) => {
  return <Input placeholder={placeholder} {...field} type={type} defaultValue={undefined}/>;
};

const NumberForm: FC<{ field: Field; placeholder?: string }> = ({
    field,
    placeholder,
  }) => {
    return <Input placeholder={placeholder} {...field} type={"number"} defaultValue={undefined}/>;
  };

  const StringForm: FC<{ field: Field; placeholder?: string }> = ({
    field,
    placeholder,
  }) => {
    return <Input placeholder={placeholder} {...field} type={"text"} defaultValue={undefined}/>;
  };

const BooleanForm: FC<{ field: Field }> = ({ field }) => {
  return <Switch checked={field.value} onCheckedChange={field.onChange} defaultValue={undefined}/>;
};

const ObjectForm: FC<{
  field: Field;
  placeholder?: string;
  name: string;
  zod: ZodTypeAny;
  form: UseFormReturn;
}> = ({ form, name, zod }) => {
  return (
    <div className="px-2 border-l-2 mx-2">
      {Object.entries((zod as AnyZodObject).shape).map(
        ([innerName, innerZod]) => {
          return (
            <FormEntry
              name={`${name}.${innerName}`}
              label={innerName}
              zod={innerZod as ZodTypeAny}
              form={form}
              key={`${name}.${innerName}`}
              placeHolder={(innerZod as ZodTypeAny).description}
            />
          );
        }
      )}
    </div>
  );
};

const ZodToComponent = (zodType: ZodTypeAny) => {
  if (zodType instanceof ZodNumber) {
    return NumberForm;
  } else if (zodType instanceof ZodString) {
    return StringForm;
  } else if (zodType instanceof ZodBoolean) {
    return BooleanForm;
  } else if (zodType instanceof ZodObject) {
    return ObjectForm;
  } else {
    return BasicForm; // default to StringForm for other types
  }
};

export const FormEntry = ({
  name,
  zod,
  form,
  label,
  placeHolder,
  ...props
}: Omit<ComponentProps<typeof FormField>, "render" | "name"> & {
  form: UseFormReturn;
  placeHolder?: string;
  name: string;
  label: string;
  zod: ZodTypeAny;
}) => {
  return (
    <FormField
      {...props}
      control={form.control}
      name={name}
      render={({ field, ...otherstuff }) => {
        const shape = (zod as AnyZodObject).shape
          ? (Object.entries((zod as AnyZodObject).shape)[0][1] as ZodTypeAny)
          : zod;
        const InputComponent = ZodToComponent(shape);
        return (
          <FormItem>
            <FormLabel className="">
              {label}
              <span className="pl-2 text-neutral-400 text-xs font-mono">
                {placeHolder}
              </span>
            </FormLabel>
            <FormControl>
              <InputComponent
                zod={shape}
                placeholder={zod.description ?? placeHolder}
                field={field}
                form={form}
                name={name}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
