"use client"

import { Export, FunctionDetails } from '@/lib/types';
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface DrawerContextProps {
    isOpen: boolean;
    openDrawer: () => void;
    closeDrawer: () => void;
    invokeFunc?: FunctionDetails;
    exp?: Export;
    setInvokeDetails: (f?: FunctionDetails, e?: Export) => void;
}

const DrawerContext = createContext<DrawerContextProps | undefined>(undefined);

export const useDrawer = () => {
    const context = useContext(DrawerContext);
    if (!context) {
        throw new Error('useDrawer must be used within a DrawerProvider');
    }
    return context;
};

interface DrawerProviderProps {
    children: ReactNode;
}

export const DrawerProvider: React.FC<DrawerProviderProps> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const [invokeFunc, setInvokingFunc] = useState<FunctionDetails>()
    const [exp, setExport] = useState<Export>()
    

    const openDrawer = () => setIsOpen(true);
    const closeDrawer = () => setIsOpen(false);

    const setInvokeDetails = (func?: FunctionDetails, exp?: Export) => {
        if(invokeFunc?.name === func?.name){
            setInvokingFunc(undefined)
            setExport(undefined);
        } else {
            setInvokingFunc(func);
            setExport(exp);
        }
    }

    return (
        <DrawerContext.Provider value={{ isOpen, openDrawer, closeDrawer, invokeFunc, setInvokeDetails, exp }}>
            {children}
        </DrawerContext.Provider>
    );
};