"use client";

import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn, getNestedValue } from "@/lib/utils";
import { Equal, Plus } from "lucide-react";
import { ComponentProps, HTMLInputTypeAttribute, useCallback, useEffect, useState } from "react";
import {
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  Path,
  PathValue,
  UseFormReturn
} from "react-hook-form";
import {
  AnyZodObject,
  ZodBoolean,
  ZodNumber,
  ZodObject,
  ZodRecord,
  ZodString,
  ZodTypeAny,
} from "zod";

type Field = ControllerRenderProps<FieldValues, string>;
interface ZodFormProps<T extends FieldValues> {
  field: Field;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  form: UseFormReturn<T>;
  name: Path<T>;
  zod: ZodTypeAny;
}

const BasicForm = <T extends FieldValues>({
  field,
  placeholder,
  type,
}: ZodFormProps<T>) => {
  return (
    <Input
      placeholder={placeholder}
      {...field}
      type={type}
    />
  );
};

const NumberForm = <T extends FieldValues>({
  field,
}: ZodFormProps<T>) => {
  const {value, onChange, ...rest} = field;
  return (
    <Input
      {...rest}
      onChange={(value) => {
        onChange(value.target.valueAsNumber)
      }}
      value={value ? Number(value): undefined}
      type={"number"}
    />
  );
};

const StringForm = <T extends FieldValues>({
  field,
  placeholder,
}: ZodFormProps<T>) => {
  return (
    <Input
      placeholder={placeholder}
      {...field}
      type={"text"}
      // {...form.register(name)}
    />
  );
};

const BooleanForm = <T extends FieldValues>({
  field,
}: ZodFormProps<T>) => {
  return (
    <Switch
      checked={field.value}
      onCheckedChange={field.onChange}
      // {...form.register(name)}
    />
  );
};

const ObjectForm = <T extends FieldValues>({
  form,
  name,
  zod,
}: ZodFormProps<T>) => {
  return (
    <div className="px-2 border-l-2 mx-2">
      {Object.entries((zod as AnyZodObject).shape).map(([
        innerName,
        innerZod,
      ]) => {
        return (
          <FormEntry
            name={`${name}.${innerName}` as Path<T>}
            label={innerName}
            zod={innerZod as ZodTypeAny}
            form={form}
            key={`${name}.${innerName}`}
            placeHolder={(innerZod as ZodTypeAny).description}
          />
        );
      })}
    </div>
  );
};

const Field = <T extends FieldValues>({ baseName, name, form }: { baseName: string; name?:string; form: UseFormReturn<T>, index: number }) => {
    const [key, setKey] = useState(name ?? "")

    const { errors } = form.formState;
    const error = getNestedValue(errors, `${baseName}.${key}`);
    const updateKey = (newKey: string) => {
      
      const currVal = (key.length? form.watch(`${baseName}.${key}` as Path<T>) : "") as PathValue<T, Path<T>>
      const currRecord =  form.watch(`${baseName}` as Path<T>);

      if(currRecord && newKey in currRecord){
        form.setError(`${baseName}.${newKey}` as Path<T>, {message: "Conflicting Keys"})
        form.setError(`${baseName}.${key}` as Path<T>, {})
      } else {
        if(key.length){
          form.unregister(`${baseName}.${key}` as Path<T>)
        }
        form.setValue(`${baseName}.${newKey}` as Path<T>, currVal)
        setKey(newKey)
      }
    }

    useEffect(() => {
      if (!error){
        form.clearErrors(`${baseName}` as Path<T>)
      }
    }, [error])
    
    return (
      <div>
        {error && <p className="text-xs text-red-600">{error.message}</p>}
      <div className="flex gap-1 items-center">
        <Input
          className={cn("basis-2/5", {"border-red-600": error})}
          value={key}
          onChange={(e) => updateKey(e.target.value)}
        /><Equal size={12} className="text-neutral-600"/>
        <Input
          {...(key.length ? (form.register(`${baseName}.${key}` as Path<T>)) :{})}
          className="basis-3/5"
        />
        
      </div>
      </div>

    );
  }

const RecordForm = <T extends FieldValues>({
  form,
  name,
}: ZodFormProps<T>) => {
  type Field = { name?: string, value?: string};
  const watchFields = form.watch(name);
  const [fields, setFields] = useState<Field[]>(watchFields ? Object.entries(watchFields).map(([name, value]) => ({name, value: value as string})) : []);

  const RecordField = useCallback((props: ComponentProps<typeof Field<T>>) => <Field<T> {...props}/> , [])

  return (
    <div className="pl-2 border-l-2 ml-2">
      {fields.map(({name: keyName}, index) => (
        <RecordField
          form={form}
          key={keyName} // important to include key with field's id
          name={keyName}
          baseName={name}
          index={index}
        />
      ))}
      <Button onClick={() => {
        // append(null, {focusIndex: -1});
        setFields([...fields, {}])
        // form.setValue(`${name}` as Path<T>, { ...fields, "": ""})
      }}><Plus size={12}/></Button>
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
  } else if (zodType instanceof ZodRecord) {
    return RecordForm;
  } else {
    return BasicForm; // default to StringForm for other types
  }
};

export const FormEntry = <T extends FieldValues>({
  name,
  zod,
  form,
  label,
  placeHolder,
  ...props
}: Omit<ComponentProps<typeof FormField>, "render" | "name" | "rules"> & {
  form: UseFormReturn<T>;
  placeHolder?: string;
  name: string;
  label: string;
  zod: ZodTypeAny;
}) => {
  return (
    <FormField<T>
      {...props}
      control={form.control}
      name={name as FieldPath<T>}
      render={({ field }) => {
        const InputComponent = ZodToComponent(zod);
        return (
          <FormItem className="w-full max-w-[400px]">
            <FormLabel className="font-mono">
              {label}
              <span className="pl-2 text-neutral-400 text-xs font-mono">
                {placeHolder}
              </span>
            </FormLabel>
              <InputComponent<T>
                zod={zod}
                placeholder={zod.description ?? placeHolder}
                field={field}
                form={form}
                name={name as Path<T>}
              />
          </FormItem>
        );
      }}
    />
  );
};
