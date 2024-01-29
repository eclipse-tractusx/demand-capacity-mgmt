import React, { createContext, useEffect, useState } from 'react';
import {useUser} from "./UserContext";

interface BottleneckContextData {

}

export const BottleneckContext = createContext<BottleneckContextData | undefined>(undefined);
 const BottleneckContextProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {
    const { access_token } = useUser();

    return (
        <BottleneckContext.Provider value={{ }}>
            {props.children}
        </BottleneckContext.Provider>
    );

}
export default BottleneckContextProvider;