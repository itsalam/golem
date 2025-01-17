import { DrawerContent } from "@/components/FocusDrawer/Worker/content";
import { FocusDrawer } from "@/components/FocusDrawer/focus-drawer";
import { fetchComponents } from "@/lib/client";
import { Component, ItemType } from "@/lib/types";

interface Params {
    params: {
        componentId: string;
        workerId: string;
    }
}

export default async function ItemPage(paramsPromise: Promise<Params>) {
    const {params} = await paramsPromise;
    const { componentId, workerId } = await params;
    const componentData: Component[] = await fetchComponents()
    const itemMetadata = componentData.find((c) => c.versionedComponentId.componentId === componentId)
    // Fetch data using itemType and itemId

    return (
      <FocusDrawer componentId={componentId} workerId={workerId} itemMetaData={itemMetadata}>
        <DrawerContent componentId={componentId} itemType={ItemType.worker} itemMetaData={itemMetadata} workerId={workerId}/>
      </FocusDrawer>
    );
  }
  