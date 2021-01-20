import React, { useEffect, useState, useCallback } from 'react';
import { getUser } from '../services/bikeApi';

export const UserContext = React.createContext();
export let User = ({ children }) => {
    let [user, setUser] = useState();

    let refreshUser = useCallback(() => {
        getUser()
            .then((res) => res.json())
            .then((user) => {
                setUser(user);
            })
            .catch(() => {
                /* swallow errors */
            });
    }, []);

    let [context, setContext] = useState({
        user,
        refreshUser,
    });

    useEffect(() => {
        setContext((oldContext) => ({ ...oldContext, user }));
    }, [user]);

    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    return (
        <UserContext.Provider value={context}>{children}</UserContext.Provider>
    );
};
