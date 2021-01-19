import React, { useContext, useRef, useState, useCallback } from 'react';
import { throttleTime } from 'rxjs/operators';
import { Pane } from 'evergreen-ui';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

import { BluetoothIcon, PauseIcon, PlayIcon } from './Icons';
import Dashboard from './Dashboard';
import { uploadPingData } from '../services/bikeApi';
import { connect } from '../services/bikeDataService';
import { LoginDialog } from './LoginDialog';
import { UserContext } from './User';

let DISCONNECTED = 'disconnected';
let CONNECTED = 'connected';
let RECORDING = 'recording';
let STOPPED = 'stopped';

function App() {
    let [activityState, setActivityState] = useState(DISCONNECTED);
    let [displayData, setDisplayData] = useState();
    let [intervalId, setIntervalId] = useState([]);
    let [sessionId, setSessionId] = useState(uuidv4());
    let { user } = useContext(UserContext);

    let unpushedData = useRef([]);
    let isRecording = useRef(false);
    let bikeData$ = useRef();
    let [message, setMessage] = useState();

    let handleNewData = useCallback(
        (data) => {
            if (user && isRecording.current) {
                unpushedData.current = [
                    ...unpushedData.current,
                    { ...data, sessionId },
                ];
            }
            setDisplayData(data);
        },
        [sessionId, user]
    );

    let handleConnect = () => {
        bikeData$.current = connect();
        setActivityState(CONNECTED);
        bikeData$.current.pipe(throttleTime(1000)).subscribe(handleNewData);
    };

    let handleUpload = () => {
        if (!user) return;

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

    let handleRecord = () => {
        setActivityState(RECORDING);
        isRecording.current = true;

        let interval = setInterval(() => {
            handleUpload();
        }, 10000);
        setIntervalId(interval);
    };

    let handleStop = () => {
        setActivityState(CONNECTED);
        isRecording.current = false;

        handleUpload();

        clearInterval(intervalId);
        setIntervalId(null);
    };

    return (
        <Pane>
            <LoginDialog />
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
