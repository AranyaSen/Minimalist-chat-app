import React, { createContext, useState } from 'react';

export const userLogInName = createContext(null);
export const userLoginId = createContext(null);

export const UserProvider = ({ children }) => {
    const [loginId, setLoginId] = useState(null);
    const [loginName, setLoginName] = useState(null);

    return (
        <userLoginId.Provider value={{ loginId, setLoginId }}>
            <userLogInName.Provider value={{ loginName, setLoginName }}>
                {children}
            </userLogInName.Provider>
        </userLoginId.Provider>
    )
};