import React, { useEffect, useState, useRef } from 'react';
import './Dashboard.css';
import { getCalories, getHeartRateZone } from './services/dataTransforms';

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

    return (
        <>
            <div className='dashboard'>
                <Meter label='kmph' value={speed} />
                <Meter label='cadence (rpm)' value={cadence} />
                <Meter label='watts' value={power} />
            </div>
            <div className='dashboard'>
                <div>
                    <Meter label='bpm' value={heartRate} />
                    <span className='heart-rate-zone'>{heartRateZone}</span>
                </div>
                <Meter label='calories' value={Math.round(calories)} />
            </div>
        </>
    );
};

const Meter = ({ label, value }) => {
    return (
        <div className='meter'>
            <div className='value'>{value}</div>
            <div className='label'>{label}</div>
        </div>
    );
};

export default Dashboard;
