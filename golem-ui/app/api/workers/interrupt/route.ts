import { GOLEM_ENDPOINT, handleResponse } from "@/lib/client";

type InterruptWorkerParams = {
  componentId: string;
  workerId: string;
  recovery?: boolean;
};

export async function POST(req: Request) {
  const { componentId, workerId, recovery } =
    (await req.json()) as InterruptWorkerParams;
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
    GOLEM_ENDPOINT +
      `/v1/components/${componentId}/workers/${workerId}/interrupt`
  );
  if (recovery !== undefined) {
    url.searchParams.append("recovery-immediately", recovery.toString());
  }

  const result = fetch(url.toString(), {
    method: "POST",
  });

  return handleResponse(result, "Interrupt Failed: ");
}
