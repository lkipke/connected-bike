import { useState, useRef, useCallback, useContext, useEffect } from 'react';
import { throttleTime } from 'rxjs/operators';
import { toaster } from 'evergreen-ui';
import { connect } from '../services/bikeDataService';
import { UserContext } from '../components/User';
import { uploadPingData } from '../services/bikeApi';
import { CONNECTED, RECORDING } from '../components/ActivityStates';

export let useBikeData = ({ sessionId, activityState, setActivityState }) => {
    let [displayData, setDisplayData] = useState();
    let [dataTickIntervalId, setDataTickIntervalId] = useState([]);
    let [isUploading, setIsUploading] = useState(false);
    let [uploadError, setUploadError] = useState(null);

    let { user } = useContext(UserContext);

    let unpushedData = useRef([]);
    let isRecording = useRef(false);
    let bikeObserver = useRef();

    let handleUpload = useCallback(() => {
        if (!user || !unpushedData.current.length) return;

        setIsUploading(true);
        setUploadError(null);

        toaster.notify('uploading data', {
            id: 'upload-status',
        });

        let uploadData = [...unpushedData.current];
        unpushedData.current = [];
        uploadPingData(uploadData)
            .then((res) => {
                if (!res.ok) throw res;
                toaster.success('upload complete!', { id: 'upload-status' });
            })
            .catch((e) => {
                console.error(e);
                unpushedData.current = [...unpushedData.current, ...uploadData];
                toaster.danger('error uploading data!', {
                    id: 'upload-status',
                });
            });
    }, [user]);

    // Handle recording start
    useEffect(() => {
        if (activityState === RECORDING && !isRecording.current) {
            isRecording.current = true;
            let interval = setInterval(() => {
                handleUpload();
            }, 10000);
            setDataTickIntervalId(interval);
        }
    }, [activityState, handleUpload]);

    // Handle recording stop
    useEffect(() => {
        if (activityState === CONNECTED && isRecording.current) {
            isRecording.current = false;
            clearInterval(dataTickIntervalId);
            setDataTickIntervalId(null);

            handleUpload();
        }
    }, [activityState, dataTickIntervalId, handleUpload]);

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

    return {
        displayData,
        handleConnect,
        isUploading,
        uploadError,
    };
};