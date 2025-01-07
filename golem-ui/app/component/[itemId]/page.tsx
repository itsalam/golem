import { DrawerContent } from "@/components/FocusDrawer/Component/drawer-content";
import { FocusDrawer } from "@/components/FocusDrawer/focus-drawer";
import { fetchComponents } from "@/lib/client";
import { Component, ItemType } from "@/lib/types";

interface Params {
    params: {
        itemType: string;
        itemId: string;
    }
}

export default async function ItemPage(paramsPromise: Promise<Params>) {
    const {params} = await paramsPromise;
    const { itemId } = await params;
    const componentData: Component[] = await fetchComponents()
    const itemMetadata = componentData.find((c) => c.versionedComponentId.componentId === itemId)
    // Fetch data using itemType and itemId
    return (
      <FocusDrawer itemId={itemId} itemType={ItemType.component} itemMetaData={itemMetadata}>
        <DrawerContent itemId={itemId} itemType={ItemType.component} itemMetaData={itemMetadata}/>
      </FocusDrawer>
    );
  }
  