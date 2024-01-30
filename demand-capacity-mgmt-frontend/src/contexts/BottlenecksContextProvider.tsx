import React, { createContext } from 'react';

interface BottleneckContextData {

}

export const BottleneckContext = createContext<BottleneckContextData | undefined>(undefined);
const BottleneckContextProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {

    return (
        <BottleneckContext.Provider value={{}}>
            {props.children}
        </BottleneckContext.Provider>
    );

}
export default BottleneckContextProvider;