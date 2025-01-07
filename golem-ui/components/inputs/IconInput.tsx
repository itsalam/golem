import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { ComponentProps, FC } from "react";
import { Input } from "../ui/input";

const IconInput: FC<
  ComponentProps<typeof Input>
> = ({ className, ...props }) => {

  return (
    <div className="relative">
        <Search className="absolute left-2 top-2 lg:top-3 h-4 w-4 text-muted-foreground" />
        <Input className={cn("h-8 lg:h-10 flex bg-transparent px-3 py-1 shadow-sm transition-colors focus-visible:ring-1 disabled:cursor-not-allowed pl-8", className)} {...props} />
    </div>
  );
};

export default IconInput;
