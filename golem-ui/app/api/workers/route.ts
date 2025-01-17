import {
  createWorker,
  CreateWorkerParams,
  fetchWorkersWithFilters,
  GOLEM_ENDPOINT,
  handleResponse,
} from "@/lib/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  if (!req.url) {
    return NextResponse.error();
  }
  const { searchParams } = new URL(req.url);
  const componentId = searchParams.get("componentId");
  const fields = searchParams.get("fields");

  const workers = await fetchWorkersWithFilters(
    componentId as string,
    JSON.parse(fields as string)
  );
  return NextResponse.json({ workers });
}

export async function POST(req: Request) {
  const { name, args, env, id } = (await req.json()) as CreateWorkerParams & {
    id: string;
  };
  if (!name || !id) {
    return new Response(
      JSON.stringify({ error: `${!name ? "Name" : "Id"} required` }),
      {
        status: 401,
      }
    );
  }
  return handleResponse(
    createWorker({ name, args, env }, id),
    "Worker creation failed: "
  );
}

export async function DELETE(req: Request) {
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
    GOLEM_ENDPOINT + `/v1/components/${componentId}/workers/${workerId}`
  );

  const result = fetch(url.toString(), {
    method: "DELETE",
  });

  return handleResponse(result, "Delete Failed: ");
}
