import React, { useContext, useState, useCallback, useEffect } from 'react';
import {
    Heading,
    Button,
    IconButton,
    Pane,
    PlayIcon as EPlayIcon,
    TickCircleIcon,
    Text,
    Spinner,
} from 'evergreen-ui';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

import { LargeBluetoothIcon, PauseIcon, PlayIcon } from './Icons';
import Dashboard from './Dashboard';
import { startSession, endSession } from '../services/bikeApi';
import { LoginDialog } from './LoginDialog';
import { UserContext } from './User';
import { Controls } from './Controls';
import { useBikeData } from '../hooks/useBikeData';
import { CONNECTED, DISCONNECTED, RECORDING } from './ActivityStates';

function App() {
    let [activityState, setActivityState] = useState(DISCONNECTED);
    let [isFirstRecord, setIsFirstRecord] = useState(true);

    let { user } = useContext(UserContext);
    let sessionId = user ? user.last_session_id : null;

    let { displayData, handleConnect } = useBikeData({
        sessionId,
        activityState,
        setActivityState,
    });

    // handle recording
    useEffect(() => {
        if (!user || !sessionId) return;

        if (isFirstRecord && activityState === RECORDING) {
            startSession(sessionId).catch((e) => console.error(e));
            setIsFirstRecord(false);
        } else if (!isFirstRecord && activityState === CONNECTED) {
            endSession(sessionId).catch((e) => console.error(e));
        }
    }, [user, activityState, sessionId, isFirstRecord]);

    return (
        <Pane>
            <LoginDialog />
            <div className='app'>
                {activityState === DISCONNECTED ? (
                    <Button
                        iconBefore={LargeBluetoothIcon}
                        appearance='minimal'
                        height={70}
                        onClick={handleConnect}
                    >
                        <Heading size={800}>connect to bike</Heading>
                    </Button>
                ) : (
                    <Button
                        iconBefore={TickCircleIcon}
                        appearance='minimal'
                        height={70}
                        disabled={true}
                    >
                        <Heading size={800}>connected</Heading>
                    </Button>
                )}

                {user && (
                    <Controls
                        activityState={activityState}
                        setActivityState={setActivityState}
                        sessionId={sessionId}
                    />
                )}

                {displayData && <Dashboard data={displayData} />}
            </div>
        </Pane>
    );
}

export default App;
