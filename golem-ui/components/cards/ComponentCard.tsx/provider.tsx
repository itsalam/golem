import { createContext, FC, ReactNode, useContext, useMemo, useState } from "react"

export enum LAYOUTS {
    List = "list",
    Grid = "grid",
}

type ComponentCardContext = {
    layout: string,
    setLayout: (layout: string) => void
}

export const ComponentCardContext = createContext<ComponentCardContext | null>(null)

export const ComponentCardProvider: FC<{children: ReactNode}> = 
  ({children}) => {

    const [layout, setLayout] = useState<string>("list");

    const contextValue = useMemo<ComponentCardContext>(
      () => ({
        layout,
        setLayout
      }),
      [layout, setLayout]
    )

    return (
      <ComponentCardContext.Provider value={contextValue}>
        {children}
      </ComponentCardContext.Provider>
    )
  }

export function useComponentCard() {
    const context = useContext(ComponentCardContext)
    if (!context) {
      throw new Error("useComponentCard must be used within a ComponentCardProvider.")
    }
  
    return context
  }
