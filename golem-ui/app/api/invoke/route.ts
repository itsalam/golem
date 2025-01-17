import { invokeFunction } from "@/lib/client";
import { FunctionDetails } from "@/lib/types";

type BodyParams = {
  funcDetails: FunctionDetails;
  componentId: string;
  exportName: string;
  workerId: string;
  params: Record<string, unknown>;
};

export async function POST(req: Request) {
  const { componentId, params, workerId, funcDetails, exportName } =
    (await req.json()) as BodyParams;
  if (!(exportName && funcDetails.name) || !componentId) {
    return Response.error();
  }

  try {
    const result = await invokeFunction(
      exportName,
      funcDetails,
      params,
      componentId as string,
      workerId
    );

    if (!result.ok) {
      return new Response(
        JSON.stringify({
          error: "Worker creation failed: " + result.statusText,
        }),
        {
          status: result.status,
          statusText: result.statusText,
        }
      );
    }

    const body = await result.json().then((json) => JSON.stringify(json));
    const contentLength = Buffer.byteLength(body);

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Length": contentLength.toString(),
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Invocation failed: " + error }),
      { status: 500 }
    );
  }
}
