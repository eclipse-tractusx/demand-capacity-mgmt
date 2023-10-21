import React, { ReactNode } from 'react';
import QuickAcessItems from '../common/QuickAcessItems';
import TopMenu from '../common/TopMenu';

interface Props {
    children: ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
    return (
        <div className='root-container'>

            <TopMenu />

            <div className='overflow-control-container'>
                {children}
                <QuickAcessItems />
            </div>
        </div>
    );
};

export default Layout;