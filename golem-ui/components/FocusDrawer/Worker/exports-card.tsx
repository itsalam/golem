"use client";

import { Component, GolemWorker } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { FC } from "react";

type EnvVarsCardProps = {
  workerEnv: GolemWorker["env"];
  itemMetaData?: Component;
};

export const EnvVarsCard: FC<EnvVarsCardProps> = ({ workerEnv, itemMetaData }) => {

  return (
    <div className="flex justify-between flex-row items-center">
        <div className="flex items-start flex-col">
          <h5 className="font-semibold text-lg">Environment Variables</h5>
          <p className="text-xs text-neutral-600">
            {Object.keys(workerEnv).length} Env Vars
          </p>
        </div>
        <div className="flex justify-between">


          <Button>Add +</Button>
        </div>

        </div>
  );
};
