import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
    Button,
    Pane,
    Spinner,
    RecordIcon as BaseRecordIcon,
    PauseIcon as BasePauseIcon,
    Text,
    toaster,
} from 'evergreen-ui';
import { v4 as uuidV4 } from 'uuid';
import { CONNECTED, DISCONNECTED, RECORDING } from './ActivityStates';
import { getSession, startSession } from '../services/bikeApi';
import { UserContext } from './User';

let RecordIcon = <BaseRecordIcon color='danger' size={20} />;
let PauseIcon = <BasePauseIcon size={20} />;

export let Controls = ({ activityState, setActivityState }) => {
    let [session, setSession] = useState({});
    let { user, refreshUser } = useContext(UserContext);

    let sessionId = (user || {}).last_session_id;

    useEffect(() => {
        getSession(sessionId)
            .then((res) => res.json())
            .then((res) => setSession(res))
            .catch((e) => console.error(e));
    }, [sessionId]);

    let createNewSession = useCallback(() => {
        let newSessionId = uuidV4();
        startSession(newSessionId)
            .then((res) => res.json())
            .then((res) => setSession(res))
            .catch((e) => {
                console.error(e);
                toaster.danger('Error creating new session');
            });
    }, []);

    if (activityState === DISCONNECTED) return null;

    return (
        <Pane
            display='flex'
            alignItems='center'
            justifyContent='center'
            marginTop={20}
        >
            {activityState === RECORDING ? (
                <Button
                    appearance='minimal'
                    iconBefore={PauseIcon}
                    onClick={() => setActivityState(CONNECTED)}
                >
                    <Text size={500}>pause</Text>
                </Button>
            ) : (
                <Button
                    appearance='minimal'
                    iconBefore={RecordIcon}
                    onClick={() => setActivityState(RECORDING)}
                >
                    <Text size={500}>record</Text>
                </Button>
            )}

            <Button
                appearance='minimal'
                disabled={activityState === RECORDING}
                onClick={() => createNewSession()}
            >
                <Text size={500}>start new session</Text>
            </Button>
        </Pane>
    );
};
