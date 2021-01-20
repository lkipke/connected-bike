import React, { useEffect, useState, useRef } from 'react';
import './Dashboard.css';
import { getCalories, getHeartRateZone } from '../services/dataTransforms';
import { Heading, Pane, Text } from 'evergreen-ui';

const Dashboard = ({ data = {} }) => {
    let { speed, cadence, power, heartRate } = data;
    let [calories, setCalories] = useState(0);
    let [heartRateZone, setHeartRateZone] = useState();
    let lastRenderTimeMs = useRef(Date.now());

    useEffect(() => {
        let currRender = Date.now();
        setCalories(
            (oldCalories) =>
                (oldCalories || 0) +
                getCalories({
                    startTimeMs: lastRenderTimeMs.current,
                    endTimeMs: currRender,
                    power,
                })
        );
        lastRenderTimeMs.current = currRender;
    }, [speed, cadence, power, heartRate, calories]);

    useEffect(() => {
        setHeartRateZone(getHeartRateZone(heartRate));
    }, [heartRate]);

    let displayCalories = calories ? Math.round(calories) : '';

    return (
        <>
            <div className='dashboard'>
                <Meter label='cadence (rpm)' value={cadence} />
                <Meter label='power' value={power} />
                <Meter label='kmph' value={speed} />
            </div>
            <div className='dashboard'>
                <Meter
                    label='heart rate'
                    value={heartRate}
                    extraInfo={heartRateZone}
                />
                <Meter label='calories' value={displayCalories} />
            </div>
        </>
    );
};

const Meter = ({ label, value, extraInfo }) => {
    return (
        <Pane paddingRight={25} paddingLeft={25}>
            <Heading size={900}>{value}</Heading>
            <Text>{label}</Text>
            {extraInfo && (
                <>
                    <br />
                    <Text>{extraInfo}</Text>
                </>
            )}
        </Pane>
    );
};

export default Dashboard;
