import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z, ZodTypeAny } from "zod";
import { Case, Parameter, TypeDefinition, WitTypes } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function dateRangeToString(
  startDate: Date,
  endDate: Date,
  formatString = (str: string) => `${str} ago`
): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (
    Math.abs(end.getTime() - new Date().getTime()) > 24 * 60 * 60 * 1000 &&
    Math.abs(start.getTime() - new Date().getTime()) > 24 * 60 * 60 * 1000
  ) {
    // Custom range
    const formatDate = (date: Date) => {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "2-digit",
      });
    };
    return `${formatDate(start)} - ${formatDate(end)}`;
  }

  const diffInMilliseconds = end.getTime() - start.getTime();
  const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);
  const diffInWeeks = diffInDays / 7;
  const diffInMonths = diffInDays / 30;
  const diffInYears = diffInDays / 365;

  const timeUnitMap = {
    year: diffInYears,
    month: diffInMonths,
    week: diffInWeeks,
    day: diffInDays,
  };

  for (const [timeUnit, count] of Object.entries(timeUnitMap)) {
    if (count >= 1) {
      const flatCount = Math.floor(count);
      return formatString(
        `${flatCount} ${timeUnit}${flatCount > 1 ? "s" : ""}`
      );
    }
  }

  return `Today`;
}

export const formatWITDataType = (input: string) => {
  const formatMap: Record<WitTypes, string> = {
    str: "string",
    [WitTypes.Record]: "",
    [WitTypes.Variant]: "",
    [WitTypes.enum]: "",
    [WitTypes["option<T>"]]: "",
    [WitTypes.List]: "",
    [WitTypes.flags]: "",
    [WitTypes.resource]: "",
  };
  return (
    formatMap[input as keyof typeof formatMap] || input
  ).toLocaleLowerCase();
};

const getTypeDefValue = (typeDef: TypeDefinition) =>
  typeDef.type && Object.keys(typeDef).length === 1
    ? formatWITDataType(typeDef.type)
    : formatTypeDefs(typeDef as TypeDefinition); // Recursive call

interface NestedTypeDef {
  [key: string]: NestedTypeDef | ZodTypeAny | string;
}

export function formatTypeDefs(typeDefs: TypeDefinition): {
  fields?: NestedTypeDef;
  cases?: NestedTypeDef;
  inner?: NestedTypeDef;
} {
  let res = {};

  if (typeDefs.fields) {
    const fields = typeDefs.fields.reduce<NestedTypeDef>((acc, field) => {
      acc[field.name] = getTypeDefValue(field.typ);
      return acc;
    }, {});
    res = { fields, ...res };
  }
  if (typeDefs.cases) {
    const cases = typeDefs.cases.reduce<NestedTypeDef>((acc, field) => {
      acc[field.name] = getTypeDefValue(field.typ);
      return acc;
    }, {});
    res = { cases, ...res };
  }
  if (typeDefs.inner) {
    const inner = { [typeDefs.inner.type]: getTypeDefValue(typeDefs.inner) };
    res = { inner, ...res };
  }

  return res;
}

const WitToZodPrimitive: Record<string, () => z.ZodTypeAny> = {
  bool: () => z.boolean().describe("bool"),
  u8: () => z.number().int().min(0).max(255).describe("u8"),
  s8: () => z.number().int().min(-128).max(127).describe("s8"),
  u16: () => z.number().int().min(0).max(65535).describe("u16"),
  s16: () => z.number().int().min(-32768).max(32767).describe("s16"),
  u32: () => z.number().int().min(0).max(4294967295).describe("u32"),
  s32: () => z.number().int().min(-2147483648).max(2147483647).describe("s32"),
  u64: () =>
    z.number().int().min(0).max(Number.MAX_SAFE_INTEGER).describe("u64"),
  s64: () =>
    z
      .number()
      .int()
      .min(Number.MIN_SAFE_INTEGER)
      .max(Number.MAX_SAFE_INTEGER)
      .describe("s64"),
  f32: () => z.number().describe("f32"),
  f64: () => z.number().describe("f64"),
  char: () => z.string().length(1),
  str: () => z.string().describe("str"),
};

export const createZodSchema = (parameters: Parameter[]) => {
  return z.object(
    parameters.reduce(
      (acc, p) => {
        acc[p.name] = createZodSchemaFromParam(p);
        return acc;
      },
      {} as Record<string, z.ZodTypeAny>
    )
  );
};

export const createZodSchemaFromParam = (
  parameter: Partial<Parameter | Case>
) => {
  let res = z.object({});
  if (!parameter) return res;
  const { name = null, typ } = parameter;
  if (!typ) return res;

  if (typ.cases && name) {
    const cases = typ.cases.reduce((acc, field) => {
      const schema = createZodSchemaFromParam(field);
      acc = acc.merge(z.object({ [field.name]: schema }));
      // acc[field.name] = createZodSchema(field.typ)
      return acc;
    }, z.object({}));
    res = res.merge(z.object({ [name]: cases }));
  } else if (typ.fields && name) {
    const fields = typ.fields.reduce((acc, field) => {
      const schema = createZodSchemaFromParam(field);
      acc = acc.merge(z.object({ [field.name]: schema }));
      // acc[field.name] = createZodSchema(field.typ)
      return acc;
    }, z.object({}));
    res = res.merge(fields);
  } else if (typ.inner) {
    const inner = z.object({
      [typ.inner.type]: createZodSchemaFromParam({ typ: typ.inner }),
    });
    res = res.merge(inner);
  } else if (name) {
    return WitToZodPrimitive[typ.type.toLocaleLowerCase()]();
  }
  return res;
};

export const getTypeFromParameters = (
  targetName: string,
  parameters: Parameter[]
) => {
  return parameters
    .map((p) => getTypeFromParameterName(targetName, p))
    .filter(Boolean)[0];
};

export const getTypeFromParameterName = (
  targetName: string,
  parameter: Partial<Parameter | Case>
): string | undefined => {
  if (!parameter || !parameter.typ) return undefined;
  const { name = null, typ } = parameter;
  if (name === targetName) return typ?.type;

  if (typ.cases) {
    const cases = typ.cases.reduce((acc, field) => {
      const res = getTypeFromParameterName(targetName, field);
      if (res) acc.push(res);
      return acc;
    }, [] as string[]);
    if (cases.length) {
      return cases[0];
    }
  } else if (typ.fields) {
    const fields = typ.fields.reduce((acc, field) => {
      const res = getTypeFromParameterName(targetName, field);
      if (res) acc.push(res);
      return acc;
    }, [] as string[]);
    if (fields.length) {
      return fields[0];
    }
  } else if (typ.inner) {
    const inner = getTypeFromParameterName(targetName, { typ: typ.inner });
    if (inner) {
      return inner;
    }
  }
  return undefined;
};

export function getNestedValue(obj: Record<string, any>, key: string): any {
  return key.split(".").reduce((acc, part) => {
    if (acc && acc.hasOwnProperty(part)) {
      return acc[part];
    }
    return undefined;
  }, obj);
}
