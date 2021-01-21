import React from 'react';
import {
    Button,
    Pane,
    RecordIcon as BaseRecordIcon,
    PauseIcon as BasePauseIcon,
    Text,
} from 'evergreen-ui';
import { CONNECTED, DISCONNECTED, RECORDING } from './ActivityStates';

let RecordIcon = <BaseRecordIcon color='danger' size={20} />;
let PauseIcon = <BasePauseIcon size={20} />;

export let Controls = ({ sessionId, activityState, setActivityState }) => {
    if (activityState === DISCONNECTED) return null;

    return (
        <>
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
            </Pane>
        </>
    );
};
