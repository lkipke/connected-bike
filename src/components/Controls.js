import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
    Button,
    Pane,
    Spinner,
    RecordIcon as BaseRecordIcon,
    PauseIcon as BasePauseIcon,
    Text,
    toaster,
    Table,
    Colors,
    Strong,
} from 'evergreen-ui';
import { v4 as uuidV4 } from 'uuid';
import { CONNECTED, DISCONNECTED, RECORDING } from './ActivityStates';
import { getSession, startSession } from '../services/bikeApi';
import { UserContext } from './User';

let RecordIcon = <BaseRecordIcon color='danger' size={20} />;
let PauseIcon = <BasePauseIcon size={20} />;

function convertDate(dateObj) {
    if (dateObj instanceof Date) {
        return `${
            dateObj.getMonth() + 1
        }/${dateObj.getDate()} ${dateObj.getHours()}:${dateObj.getMinutes()}`;
    }

    return 'null';
}

export let Controls = ({ activityState, setActivityState }) => {
    let [session, setSession] = useState();
    let { user, setUser } = useContext(UserContext);

    useEffect(() => {
        if (
            user &&
            user.last_session_id &&
            (!session || session.id !== user.last_session_id)
        ) {
            getSession(user.last_session_id)
                .then((res) =>
                    setSession({
                        start: convertDate(res.session_id),
                        id: res.session_id,
                    })
                )
                .catch((e) => console.error(e));
        }
    }, [user, session]);

    let createNewSession = useCallback(() => {
        let newSessionId = uuidV4();
        startSession(newSessionId)
            .then((res) => {
                setUser((oldUser) => ({
                    ...oldUser,
                    last_session_id: newSessionId,
                }));
                setSession({
                    start: convertDate(res.session_id),
                    id: res.session_id,
                });
            })
            .catch((e) => {
                console.error(e);
                toaster.danger('Error creating new session');
            });
    }, [setUser]);

    if (activityState === DISCONNECTED) return null;

    return (
        <>
            {session && (
                <Pane display='flex' flexDirection='column' marginTop={20}>
                    <Text>
                        session id: <Strong>{session.id}</Strong>
                    </Text>
                    <Text>
                        start time: <Strong>{session.start}</Strong>
                    </Text>
                </Pane>
            )}
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
        </>
    );
};
