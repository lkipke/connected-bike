import React, { useEffect, useState, useRef } from 'react';
import './Dashboard.css';
import { getCalories, getHeartRateZone } from '../services/dataTransforms';
import { Heading, Pane, Text } from 'evergreen-ui';

const Dashboard = ({ data = {} }) => {
    let { speed, cadence, power, heartRate, calories } = data;
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
                    extraInfo={getHeartRateZone(heartRate)}
                />
                <Meter label='calories' value={calories} />
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
