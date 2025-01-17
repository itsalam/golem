
import { FocusProvider } from '@/components/FocusDrawer/item-provider';
import { ReactNode } from 'react';

interface ProvidersProps {
    children: ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
    return (
        <FocusProvider>
            {children}
        </FocusProvider>
    );
};

export default Providers;