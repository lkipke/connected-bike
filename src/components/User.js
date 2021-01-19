import React, { useEffect, useState } from 'react';
import { getUser } from '../services/bikeApi';

export const UserContext = React.createContext();
export let User = ({ children }) => {
    let [user, setUser] = useState();
    let [context, setContext] = useState({
        user,
        setUser,
    });

    useEffect(() => {
        setContext((oldContext) => ({ ...oldContext, user }));
    }, [user]);

    useEffect(() => {
        getUser()
            .then((res) => res.json())
            .then((user) => setUser(user))
            .catch(() => {
                /* swallow errors */
            });
    }, []);

    return (
        <UserContext.Provider value={context}>{children}</UserContext.Provider>
    );
};
