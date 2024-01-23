import React, { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Props {
    children: ReactNode;
}

const ToastContainerComponent: React.FC<Props> = ({ children }) => {
    return (<>
        <ToastContainer
            position="bottom-left"
            autoClose={12000}
            hideProgressBar={false}
            newestOnTop
            rtl={false}
            draggable={false}
            pauseOnHover
            theme="light" />
        {children}</>

    );
};

export default ToastContainerComponent;