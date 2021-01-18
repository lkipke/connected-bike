import React, { useRef, useState } from 'react';
import { throttleTime } from 'rxjs/operators';
import { connect } from '../services/bikeDataService';
import Dashboard from './Dashboard';
import { BluetoothIcon, PauseIcon, PlayIcon, StopIcon } from './Icons';
import './App.css';
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { uploadPingData } from '../services/bikeApi';
import { Button, Pane } from 'evergreen-ui';
import { LoginDialog } from './LoginDialog';

const DISCONNECTED = 'disconnected';
const CONNECTED = 'connected';
const RECORDING = 'recording';
const STOPPED = 'stopped';

function App() {
    const [activityState, setActivityState] = useState(DISCONNECTED);
    const [displayData, setDisplayData] = useState();
    const [intervalId, setIntervalId] = useState([]);
    const [sessionId, setSessionId] = useState(uuidv4());
    const [isDialogShown, setDialogShown] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState(null);

    const unpushedData = useRef([]);
    const isRecording = useRef(false);
    const bikeData$ = useRef();
    const [message, setMessage] = useState();

    const handleNewData = useCallback(
        (data) => {
            if (isRecording.current) {
                unpushedData.current = [
                    ...unpushedData.current,
                    { ...data, sessionId },
                ];
            }
            setDisplayData(data);
        },
        [sessionId]
    );

    const handleConnect = () => {
        bikeData$.current = connect();
        setActivityState(CONNECTED);
        bikeData$.current.pipe(throttleTime(1000)).subscribe(handleNewData);
    };

    const handleUpload = () => {
        let uploadData = [...unpushedData.current];
        unpushedData.current = [];

        setMessage('Uploading...');
        try {
            uploadPingData(uploadData);
            setMessage('Upload complete!');
        } catch (e) {
            setMessage('Upload error!');
            console.error(e);
            unpushedData.current = [...unpushedData.current, ...uploadData];
        }
    };

    const handleRecord = () => {
        setActivityState(RECORDING);
        isRecording.current = true;

        let interval = setInterval(() => {
            handleUpload();
        }, 10000);
        setIntervalId(interval);
    };

    const handleStop = () => {
        setActivityState(CONNECTED);
        isRecording.current = false;

        handleUpload();

        clearInterval(intervalId);
        setIntervalId(null);
    };

    return (
        <Pane>
            <Button onClick={() => setDialogShown(true)}>
                {loggedInUser ? loggedInUser.username : 'log in'}
            </Button>
            <LoginDialog
                isDialogShown={isDialogShown}
                setDialogShown={setDialogShown}
                setLoggedInUser={setLoggedInUser}
            />
            <div className='app'>
                <h1>connected bike</h1>
                {message && (
                    <div>
                        <span className='message'>{message}</span>
                    </div>
                )}

                {activityState === DISCONNECTED && (
                    <button onClick={handleConnect}>
                        <BluetoothIcon />
                    </button>
                )}

                {(activityState === CONNECTED || activityState === STOPPED) && (
                    <button onClick={handleRecord}>
                        <PlayIcon />
                    </button>
                )}

                {activityState === RECORDING && (
                    <button onClick={handleStop}>
                        <PauseIcon />
                    </button>
                )}

                {displayData && <Dashboard data={displayData} />}
            </div>
        </Pane>
    );
}

export default App;
