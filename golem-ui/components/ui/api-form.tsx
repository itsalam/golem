"use client";
import { Card } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { Braces, Eraser, LetterText, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { DefaultValues, useForm } from "react-hook-form";
import { z, ZodObject, ZodTypeAny } from "zod";
import { Code } from "../ui/codeblock";
import { Form } from "../ui/form";
import { Button } from "./button";
import { Switch } from "./switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

import { cn } from "@/lib/utils";
import { json, jsonParseLinter } from "@codemirror/lang-json";
import { linter } from "@codemirror/lint";
import CodeMirror, { basicSetup, EditorView } from "@uiw/react-codemirror";
import { Badge } from "./badge";

export type APIFormType = ZodObject<Record<string, z.ZodTypeAny>>;

interface APIFormProps<T extends APIFormType> {
  schema: T;
  defaultValues?: DefaultValues<T>;
  renderForm: (
    key: string,
    form: ReturnType<typeof useForm<T>>,
    zodType: ZodTypeAny
  ) => React.ReactNode;
  submitHandler: (data: z.infer<T>) => Promise<Response>;
}

export const APIForm = <T extends APIFormType>({
  schema,
  defaultValues,
  renderForm,
  submitHandler,
}: APIFormProps<T>) => {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const schemaKeys = Object.entries(schema.shape);

  const [apiResponse, setApiResponse] = useState<Response>();
  const [responseJson, setResponseJson] =
    useState<Awaited<ReturnType<Response["json"]>>>();
  const [responseBytes, setReponseBytes] = useState<number>();
  const [responseTime, setResponseTime] = useState<number>();

  useEffect(() => {
    form.reset({} as T);
    setApiResponse(undefined);
    setResponseJson(undefined);
    setReponseBytes(undefined);
    setResponseTime(undefined);
  }, [form, schema]);

  const resultHandler = (data: z.infer<T>) => {
    const start = performance.now();
    return submitHandler(data).then(async (data) => {
      const end = performance.now(); // End time
      setApiResponse(data);
      await data.json().then((json) => setResponseJson(json));
      console.log(...data.headers.values())
      console.log(data)
      const contentLength = data.headers.get("content-length");
      if (contentLength && Number(contentLength)) {
        setReponseBytes(Number(contentLength));
      }
      setResponseTime(end - start);
      return data;
    })
  };

  return (
    <div className="flex flex-col p-2 gap-4 text-sm overflow-auto">
      <Card className="p-4">
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form
                .handleSubmit(resultHandler)(e)
                .then(
                  (...e) => console.trace(e),
                  (e) => console.trace(e)
                );
            }}
          >
            <Tabs defaultValue="form" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger
                  className="flex-1 flex items-center gap-1"
                  value="form"
                >
                  Form <LetterText size={16} />{" "}
                </TabsTrigger>
                <TabsTrigger
                  className="flex-1 flex items-center gap-1"
                  value="json"
                >
                  JSON <Braces size={16} />{" "}
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="form"
                className="flex flex-wrap gap-4 items-stretch"
              >
                {schemaKeys.map(([key, zodtype]) => {
                  return renderForm(key, form, zodtype as ZodTypeAny);
                })}
                {schemaKeys.length === 0 && (
                  <p className="text-neutral-400 p-4"> No params required. </p>
                )}
              </TabsContent>
              <TabsContent value="json">
                <Code form={form} />
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 mt-4 items-center">
              <div className="text-sm flex text-nowrap gap-1">
                Preview Types <Switch></Switch>
              </div>
              <Button type="button" onClick={() => form.reset({} as T)}>
                Clear <Eraser size={16} />{" "}
              </Button>
              <Button type="submit">
                Invoke <Play size={16} />{" "}
              </Button>
            </div>
            {apiResponse && (
              <div className="flex gap-2 py-4">
                <div className="flex items-center gap-1 text-neutral-400">
                  Status:
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-semibold text-sm",
                      {
                        "text-green-400 border-green-400":
                          apiResponse.status >= 200 && apiResponse.status < 300,
                        "text-red-400 border-red-400":
                          apiResponse.status >= 400,
                        "text-yellow-400 border-yellow-400":
                          apiResponse.status >= 300 && apiResponse.status < 400,
                        "text-blue-400 border-blue-400":
                          apiResponse.status >= 100 && apiResponse.status < 200,
                      }
                    )}
                  >
                    {`${apiResponse.status} ${apiResponse.statusText}`}
                  </Badge>
                </div>
                {responseBytes && (
                  <div className="flex items-center gap-1 text-neutral-400">
                    Size:
                    <p className="text-sm font-semibold text-card-foreground">{responseBytes} Bytes</p>
                  </div>
                )}
                {responseTime && (
                  <div className="flex items-center gap-1 text-neutral-400">
                    Time:
                    <p className="text-sm font-semibold text-card-foreground">
                      {Math.round(responseTime)}ms
                    </p>
                  </div>
                )}
              </div>
            )}
            {responseJson && (
              <CodeMirror
                
                className="rounded-sm border"
                value={JSON.stringify(responseJson, null, 2)}
                extensions={[
                  ...basicSetup(),
                  json(),
                  linter(jsonParseLinter()),
                  EditorView.lineWrapping
                ]}
              />
            )}
          </form>
        </Form>
      </Card>
    </div>
  );
};
