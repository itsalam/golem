import { DrawerContent } from "@/components/FocusDrawer/Worker/content";
import { FocusDrawer } from "@/components/FocusDrawer/focus-drawer";
import { fetchComponents } from "@/lib/client";
import { Component, ItemType } from "@/lib/types";

interface Params {
    params: {
        itemId: string;
        workerId: string;
    }
}

export default async function ItemPage(paramsPromise: Promise<Params>) {
    const {params} = await paramsPromise;
    const { itemId, workerId } = await params;
    const componentData: Component[] = await fetchComponents()
    const itemMetadata = componentData.find((c) => c.versionedComponentId.componentId === itemId)
    // Fetch data using itemType and itemId

    return (
      <FocusDrawer itemId={workerId} itemType={ItemType.component} itemMetaData={itemMetadata}>
        <DrawerContent componentId={itemId} itemType={ItemType.component} itemMetaData={itemMetadata} workerId={workerId}/>
      </FocusDrawer>
    );
  }
  