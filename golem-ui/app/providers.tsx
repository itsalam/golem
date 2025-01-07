import { FocusProvider } from '@/components/FocusDrawer/focus-drawer';
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