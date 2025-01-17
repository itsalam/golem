import {
  Component,
  FunctionDetails,
  GolemWorker,
  VersionComparison,
  WorkerSearchFields,
} from "./types";

export const GOLEM_ENDPOINT =
  process.env.NEXT_PUBLIC_GOLEM_ENDPOINT || "default_endpoint";

export const fetchComponents = async (): Promise<Component[]> => {
  return await fetch(GOLEM_ENDPOINT + "/v1/components").then((v) => v.json());
};

export const fetchComponentVersions = async (
  id: string
): Promise<Component[]> => {
  return await fetch(GOLEM_ENDPOINT + `/v1/components/${id}`).then((v) =>
    v.json());
};

export const fetchWorkersWithFilters = async (
  id: string,
  fields?: WorkerSearchFields
) => {
  const filters: string[] = [];
  if (fields?.dateRange) {
    filters.push(`createdAt > ${fields.dateRange.from}`);
    filters.push(`createdAt < ${fields.dateRange.to}`);
  }
  if (fields?.version) {
    filters.push(
      `version ${fields.versionComparison ?? VersionComparison.EQ} ${fields.version}`
    );
  }

  if (fields?.name) {
    filters.push(`name ${fields.nameComparison ?? "like"} ${fields.name}`);
  }

  const requests =
    fields?.statuses?.map((status) => {
      return [...filters, `status = ${status}`];
    }) ?? [];

  if (requests.length === 0) {
    requests.push(filters);
  }

  const workersReq = await Promise.all<{ workers: GolemWorker[] }>(
    requests.flatMap((req) => {
      const queryParams = req
        .map((filter) => `filter=${encodeURIComponent(filter)}`)
        .join("&");
      return fetch(
        GOLEM_ENDPOINT + `/v1/components/${id}/workers?${queryParams}`
      ).then((v) => v.json());
    })
  );

  return workersReq.flatMap((req) => req.workers);
};

export type CreateWorkerParams = {
  name: string;
  args?: string;
  env?: Record<string, string>;
};

export const createWorker = async (params: CreateWorkerParams, id: string) => {
  const { name, args = "", env = {} } = params;
  const arrArgs = args.length ? args.split("") : [];
  return await fetch(GOLEM_ENDPOINT + `/v1/components/${id}/workers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      args: arrArgs,
      env,
    }),
  });
};

export const invokeFunction = async (
  exportName: string,
  funcDetails: FunctionDetails,
  params: object,
  componentId: string,
  workerId: string
) => {
  const url = new URL(
    GOLEM_ENDPOINT +
      `/v1/components/${componentId}${workerId ? `/workers/${workerId}` : ""}/invoke-and-await`
  );
  url.searchParams.append("function", exportName + `.{${funcDetails.name}}`);

  const values = Object.values(params);
  const body = {
    params: funcDetails.parameters.map((p, i) => ({
      typ: p.typ,
      value: values[i],
    })),
  };

  return await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
};

export const handleResponse = async (
  request: Promise<Response>,
  errorPrefix = "Fetch failed: "
) => {
  try {
    const result = await request;
    if (!result.ok) {
      return new Response(
        JSON.stringify({
          error: errorPrefix + result.statusText,
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
    return new Response(JSON.stringify({ error: errorPrefix + error }), {
      status: 500,
    });
  }
};
