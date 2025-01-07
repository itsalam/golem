import {
    Export,
    TypeDefinition,
    WitTypes
} from "@/lib/types";
  
  import { formatTypeDefs, formatWITDataType } from "@/lib/utils";
  
  import { FC } from "react";
import { Badge } from "../../ui/badge";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "../../ui/hover-card";
  
  type ExportTableProps = {
    exp: Export;
  };
  
  export const ExportType: FC<{ typeDefs: TypeDefinition; name?: string }> = ({
    typeDefs,
    name,
  }) => {
    let { type, ...otherTypeDefs } = typeDefs;
    let formattedTypeDefs: Record<string, unknown> = otherTypeDefs;
  
    type = WitTypes[type as keyof typeof WitTypes] || type;
  
    if (name && Object.keys(otherTypeDefs).length === 0) {
      return (
        <span>
          {name}: {formatWITDataType(type)}
        </span>
      );
    }
    if (type === WitTypes.Record && otherTypeDefs.fields) {
      formattedTypeDefs = formatTypeDefs(typeDefs).fields ?? {};
      return (
        <span>
          {name}:{" "}
          <HoverParams badgeTitle={formatWITDataType(type)} paramContent={JSON.stringify(formattedTypeDefs, null, " ")}/>
        </span>
      );
    }
  
    if (type === WitTypes.List && otherTypeDefs.inner) {
      formattedTypeDefs = formatTypeDefs(typeDefs).inner ?? {};
      type = otherTypeDefs.inner.type;
  
      return <HoverParams badgeTitle={"list<" + formatWITDataType(type) + ">"} paramContent={JSON.stringify(formattedTypeDefs, null, " ")}/>
    }
  
    if (type === WitTypes.Variant && otherTypeDefs.cases) {
        formattedTypeDefs = formatTypeDefs(typeDefs).cases ?? {};
        return <HoverParams badgeTitle={"variants: " + Object.values(formattedTypeDefs).length} paramContent={JSON.stringify(formattedTypeDefs, null, " ")}/>
    }
  
    return (
      <HoverParams badgeTitle={formatWITDataType(type)} paramContent={JSON.stringify(formattedTypeDefs, null, " ")}/>
    );
  };
  
  
  const HoverParams: FC<{badgeTitle: string, paramContent:string}> = ({badgeTitle, paramContent}) => {
    const formattedJSON = JSON.stringify(JSON.parse(paramContent.trim()), null, 2);
  
    return <HoverCard>
    <HoverCardTrigger asChild>
      <Badge className="text-xs">{badgeTitle}</Badge>
    </HoverCardTrigger>
    <HoverCardContent className="w-80">
      <div className="flex justify-between space-x-4">
        <p className="font-mono text-sm whitespace-pre text-left">
          {formattedJSON}
        </p>
      </div>
    </HoverCardContent>
  </HoverCard>
  }
  
  