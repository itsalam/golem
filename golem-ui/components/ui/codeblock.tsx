import { json, jsonParseLinter } from "@codemirror/lang-json";
import { linter } from "@codemirror/lint";
import CodeMirror, { basicSetup } from "@uiw/react-codemirror";
import { UseFormReturn } from "react-hook-form";
import { APIFormType } from "./api-form";

export const Code = <T extends APIFormType>({
  form,
}: {
  form: UseFormReturn<T>;
}) => {
  const values = form.watch();

  return (
    <CodeMirror
      editable
      value={JSON.stringify(values, null, 2)}
      extensions={[...basicSetup(), json(), linter(jsonParseLinter())]}
      className="rounded-md border"
      onChange={(v) => {
        try {
          form.reset(JSON.parse(v));
        } catch (e) {
          console.log(e);
        }
      }}
    />
  );
};
