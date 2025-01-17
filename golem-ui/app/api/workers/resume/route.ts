import { GOLEM_ENDPOINT, handleResponse } from "@/lib/client";

export async function POST(req: Request) {
  const { componentId, workerId } = await req.json();
  if (!componentId || !workerId) {
    return new Response(
      JSON.stringify({
        error: `${!componentId ? "ComponentId" : "WorkerId"} required`,
      }),
      {
        status: 401,
      }
    );
  }

  const url = new URL(
    GOLEM_ENDPOINT + `/v1/components/${componentId}/workers/${workerId}/resume`
  );

  const result = fetch(url.toString(), {
    method: "POST",
  });

  return handleResponse(result, "Interrupt Failed: ");
}
