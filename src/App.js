import React, { useRef, useState } from 'react';
import { throttleTime } from 'rxjs/operators';
import { connect } from './services/bikeDataService';
import Dashboard from './Dashboard';
import { BluetoothIcon, PauseIcon, PlayIcon, StopIcon } from './Icons';
import './App.css';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { uploadPingData } from './services/bikeApi';

const DISCONNECTED = 'disconnected';
const CONNECTED = 'connected';
const RECORDING = 'recording';
const STOPPED = 'stopped';

function App() {
    const [activityState, setActivityState] = useState(DISCONNECTED);
    const [displayData, setDisplayData] = useState();
    const [intervalId, setIntervalId] = useState([]);
    const [sessionId, setSessionId] = useState(uuidv4());

    // TODO find a way to not duplicate this flag
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
        }, 2000);
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

            {<Dashboard data={displayData} />}
        </div>
    );
}

export default App;
