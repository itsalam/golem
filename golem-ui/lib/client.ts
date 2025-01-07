import { Component } from "./types";

export const GOLEM_ENDPOINT =
  process.env.NEXT_PUBLIC_GOLEM_ENDPOINT || "default_endpoint";

export const fetchComponents = async (): Promise<Component[]> => {
  return await fetch(GOLEM_ENDPOINT + "/v1/components").then((v) => v.json());
};

export const fetchComponentMetadata = async (
  id: string
): Promise<Component> => {
  return await fetch(
    GOLEM_ENDPOINT + `/v1/components/v1/components/${id}`
  ).then((v) => v.json());
};
