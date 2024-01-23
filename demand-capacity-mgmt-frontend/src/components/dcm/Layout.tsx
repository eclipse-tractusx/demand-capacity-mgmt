import React, { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
                <ToastContainer
                    position="bottom-left"
                    autoClose={12000}
                    hideProgressBar={false}
                    newestOnTop
                    rtl={false}
                    pauseOnFocusLoss
                    draggable={false}
                    pauseOnHover
                    theme="light" />
            </div>
        </div>
    );
};

export default Layout;