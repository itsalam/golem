import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Grid2X2, List } from "lucide-react";
import { LAYOUTS, useComponentCard } from "./provider";

export const LayoutSwitch = () => {
    const {setLayout} = useComponentCard();

    return <ToggleGroup className="border rounded-md" onValueChange={setLayout} type="single">
    <ToggleGroupItem value={LAYOUTS.Grid} aria-label="Toggle bold">
      <Grid2X2 className="h-4 w-4" />
    </ToggleGroupItem>
    <ToggleGroupItem value={LAYOUTS.List}  aria-label="Toggle italic">
      <List className="h-4 w-4" />
    </ToggleGroupItem>
  </ToggleGroup>
}