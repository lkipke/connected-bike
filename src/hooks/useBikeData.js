import { useState, useRef, useCallback, useContext } from 'react';
import { throttleTime } from 'rxjs/operators';
import { connect } from '../services/bikeDataService';
import { UserContext } from '../components/User';
import { uploadPingData } from '../services/bikeApi';

export let DISCONNECTED = 'disconnected';
export let CONNECTED = 'connected';
export let RECORDING = 'recording';
export let STOPPED = 'stopped';

export let useBikeData = (sessionId) => {
    let [activityState, setActivityState] = useState(DISCONNECTED);
    let [displayData, setDisplayData] = useState();
    let [dataTickIntervalId, setDataTickIntervalId] = useState([]);
    let [isUploading, setIsUploading] = useState(false);
    let [uploadError, setUploadError] = useState(null);

    let { user } = useContext(UserContext);

    let unpushedData = useRef([]);
    let isRecording = useRef(false);
    let bikeObserver = useRef();

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
        bikeObserver.current = connect();
        setActivityState(CONNECTED);
        bikeObserver.current.pipe(throttleTime(1000)).subscribe(handleNewData);
    };

    let handleRecord = () => {
        setActivityState(RECORDING);
        isRecording.current = true;

        let interval = setInterval(() => {
            handleUpload();
        }, 10000);
        setDataTickIntervalId(interval);
    };

    let handleUpload = () => {
        if (!user) return;

        setIsUploading(true);
        setUploadError(null);

        let uploadData = [...unpushedData.current];
        unpushedData.current = [];
        uploadPingData(uploadData)
            .then(() => setIsUploading(false))
            .catch((e) => {
                console.error(e);
                unpushedData.current = [...unpushedData.current, ...uploadData];
                setUploadError('Error uploading data!');
            });
    };

    let handleStop = () => {
        setActivityState(CONNECTED);
        isRecording.current = false;

        handleUpload();
        clearInterval(dataTickIntervalId);
        setDataTickIntervalId(null);
    };

    return {
        activityState,
        displayData,
        handleConnect,
        handleRecord,
        handleStop,
        isUploading,
        uploadError,
    };
};
