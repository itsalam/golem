import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GOLEM_ENDPOINT } from "@/lib/client";
import { cn } from "@/lib/utils";
import { ComponentProps, FC } from "react";

const APICard: FC<ComponentProps<typeof Card>> = async ({className, ...props}) => {
    const apiData = await fetch(GOLEM_ENDPOINT + "/v1/api/definitions").then((v) => v.json())

    return <Card className={cn("m-2 h-fit", className)} {...props}>
    <CardHeader className="flex-row">
      <CardTitle>APIs</CardTitle>

    </CardHeader>
    <CardContent>

    </CardContent>
  </Card>
}

export default APICard;