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
import {
    useBikeData,
    RECORDING,
    DISCONNECTED,
    CONNECTED,
} from '../hooks/useBikeData';

function App() {
    let [sessionId, setSessionId] = useState(uuidv4());
    let [isFirstRecord, setIsFirstRecord] = useState(true);

    let { user } = useContext(UserContext);
    let {
        activityState,
        displayData,
        handleConnect,
        handleRecord,
        isUploading,
        uploadError,
    } = useBikeData(sessionId);

    // handle recording
    useEffect(() => {
        if (!user) return;
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
                {activityState === DISCONNECTED && (
                    <Button
                        iconBefore={LargeBluetoothIcon}
                        onClick={handleConnect}
                        disabled={activityState !== DISCONNECTED}
                        appearance='minimal'
                        height={70}
                    >
                        <Heading size={800}>connect to bike</Heading>
                    </Button>
                )}

                {activityState !== DISCONNECTED && (
                    <Button
                        appearance='minimal'
                        height={70}
                        iconBefore={TickCircleIcon}
                        disabled={true}
                    >
                        <Heading size={800}>connected</Heading>
                    </Button>
                )}

                {uploadError && (
                    <Text size={500} color='#ec4c47'>
                        {uploadError}
                    </Text>
                )}

                {isUploading && (
                    <Pane
                        display='flex'
                        alignItems='center'
                        justifyContent='center'
                    >
                        <Spinner size={24} marginRight={10} />
                        <Text size={500}>uploading...</Text>
                    </Pane>
                )}

                <Pane
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    marginTop={20}
                >
                    {activityState === CONNECTED && (
                        <Button>start new session</Button>
                    )}
                </Pane>

                {displayData && <Dashboard data={displayData} />}
            </div>
        </Pane>
    );
}

export default App;
