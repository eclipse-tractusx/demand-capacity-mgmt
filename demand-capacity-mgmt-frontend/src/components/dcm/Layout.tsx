import React, { ReactNode } from 'react';
import CapacityGroupsProvider from '../../contexts/CapacityGroupsContextProvider';
import DemandCategoryContextProvider from '../../contexts/DemandCategoryProvider';
import EventsContextProvider from '../../contexts/EventsContextProvider';
import { InfoMenuProvider } from '../../contexts/InfoMenuContextProvider';
import QuickAcessItems from '../common/QuickAcessItems';
import TopMenu from '../common/TopMenu';

interface Props {
    children: ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
    return (
        <div className='root-container'>
            <DemandCategoryContextProvider>
                <CapacityGroupsProvider>
                    <EventsContextProvider>
                        <InfoMenuProvider>
                            <TopMenu />
                        </InfoMenuProvider>
                    </EventsContextProvider>
                </CapacityGroupsProvider>
            </DemandCategoryContextProvider>

            <div className='overflow-control-container'>
                {children}
                <QuickAcessItems />
            </div>
        </div>
    );
};

export default Layout;