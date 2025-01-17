import { DrawerContent } from "@/components/FocusDrawer/Component/content";
import { FocusDrawer } from "@/components/FocusDrawer/focus-drawer";
import { fetchComponents } from "@/lib/client";
import { Component } from "@/lib/types";

interface Params {
    params: {
        componentId: string;
    }
}

export default async function ItemPage(paramsPromise: Promise<Params>) {
    const {params} = await paramsPromise;
    const { componentId } = await params;
    const componentData: Component[] = await fetchComponents()
    const itemMetadata = componentData.find((c) => c.versionedComponentId.componentId === componentId)
    // Fetch data using itemType and itemId
    return (
      <FocusDrawer componentId={componentId} itemMetaData={itemMetadata}>
        <DrawerContent componentId={componentId} itemMetaData={itemMetadata}/>
      </FocusDrawer>
    );
  }
  