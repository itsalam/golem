import { X } from "lucide-react";
import { ComponentProps, FC } from "react";
import { Button } from "./button";

export const XButton: FC<ComponentProps<"button">> = ({children, ...props}) => (
<Button
variant={"outline"}
size={"icon"}
    {...props}
  >
    {children}
    <X className="h-4 w-4 " />
  </Button>
);
