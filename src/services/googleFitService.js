// https://www.googleapis.com/fitness/v1/users/me/sessions?startTime=2020-10-01T00:00:00.000Z&endTime=2020-10-30T23:59:59.999Z

import { getUserCookie } from "./cookieService";
import subDays from "date-fns/subDays";

export const POWER = "com.google.power.sample";
export const HEART_RATE = "com.google.heart_rate.bpm";
export const CADENCE = "com.google.cycling.pedaling.cadence";
export const MOVE_MINUTES = "com.google.active_minutes";
export const HEART_POINTS = "com.google.heart_minutes";
export const CALORIES = "com.google.calories.expended";

const APPLICATION = {
  detailsUrl: "https://github.com/ericsakmar/connected-bike",
  name: "Connected Bike",
  version: "1",
};

const DEVICE = {
  manufacturer: "Eric Sakmar",
  model: "Web App",
  type: "unknown",
  uid: "2112",
  version: "1.0",
};

const POWER_DATA_SOURCE = {
  dataStreamName: "Connected Bike - Power",
  type: "raw",
  application: APPLICATION,
  dataType: { name: POWER },
  device: DEVICE,
};

const HEART_RATE_DATA_SOURCE = {
  dataStreamName: "Connected Bike - Heart Rate",
  type: "raw",
  application: APPLICATION,
  dataType: { name: HEART_RATE },
  device: DEVICE,
};

const CADENCE_DATA_SOURCE = {
  dataStreamName: "Connected Bike - Cadence",
  type: "raw",
  application: APPLICATION,
  dataType: { name: CADENCE },
  device: DEVICE,
};

const MOVE_MINUTES_DATA_SOURCE = {
  dataStreamName: "Connected Bike - Move Minutes",
  type: "raw",
  application: APPLICATION,
  dataType: { name: MOVE_MINUTES },
  device: DEVICE,
};

const HEART_POINTS_DATA_SOURCE = {
  dataStreamName: "Connected Bike - Heart Points",
  type: "raw",
  application: APPLICATION,
  dataType: { name: HEART_POINTS },
  device: DEVICE,
};

const CALORIES_DATA_SOURCE = {
  dataStreamName: "Connected Bike - Calories",
  type: "raw",
  application: APPLICATION,
  dataType: { name: CALORIES },
  device: DEVICE,
};

const buildHeaders = () => {
  const user = getUserCookie();

  return new Headers({
    Authorization: `Bearer ${user.accessToken}`,
  });
};

export const nowNs = () =>
  (window.performance.now() + window.performance.timeOrigin) * 1000000;

export const getDataSources = async () => {
  const res = await fetch(
    "https://www.googleapis.com/fitness/v1/users/me/dataSources",
    {
      method: "GET",
      headers: buildHeaders(),
    }
  );

  const json = await res.json();
  return json.dataSource;
};

export const getDataSource = async (baseDataSource) => {
  const name = baseDataSource.dataStreamName;

  // check local cache
  const localDataSource = localStorage.getItem(name);
  if (localDataSource) {
    return JSON.parse(localDataSource);
  }

  // check if it already exists online
  const dataSources = await getDataSources();
  const remoteDataSource = dataSources.find((d) => d.dataStreamName === name);
  if (remoteDataSource) {
    localStorage.setItem(name, JSON.stringify(remoteDataSource));
    return remoteDataSource;
  }

  // it doesn't exist, so add it
  const newDataSource = await createDataSource(baseDataSource);
  localStorage.setItem(name, JSON.stringify(remoteDataSource));
  return newDataSource;
};

export const createDataSource = async (dataSource) => {
  const res = await fetch(
    "https://www.googleapis.com/fitness/v1/users/me/dataSources",
    {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(dataSource),
    }
  );

  const json = await res.json();
  return json;
};

export const uploadDataSet = async (baseDataSource, dataSet) => {
  const dataSource = await getDataSource(baseDataSource);
  const dataSetWithId = { ...dataSet, dataSourceId: dataSource.dataStreamId };
  const url = `https://www.googleapis.com/fitness/v1/users/me/dataSources/${dataSource.dataStreamId}/datasets/${dataSetWithId.minStartTimeNs}-${dataSetWithId.maxEndTimeNs}`;

  const res = await fetch(url, {
    method: "PATCH",
    headers: buildHeaders(),
    body: JSON.stringify(dataSetWithId),
  });

  return res.ok;
};

const findDataSet = (dataSets, id) =>
  dataSets.find((d) => d.point[0].dataTypeName === id);

export const uploadSession = async (dataSets) => {
  const powerData = findDataSet(dataSets, POWER);
  const heartRateData = findDataSet(dataSets, HEART_RATE);
  const cadenceData = findDataSet(dataSets, CADENCE);
  const moveMinutes = findDataSet(dataSets, MOVE_MINUTES);
  const heartPoints = findDataSet(dataSets, HEART_POINTS);
  const calories = findDataSet(dataSets, CALORIES);

  await uploadDataSet(POWER_DATA_SOURCE, powerData);
  await uploadDataSet(HEART_RATE_DATA_SOURCE, heartRateData);
  await uploadDataSet(CADENCE_DATA_SOURCE, cadenceData);
  await uploadDataSet(MOVE_MINUTES_DATA_SOURCE, moveMinutes);
  await uploadDataSet(HEART_POINTS_DATA_SOURCE, heartPoints);
  await uploadDataSet(CALORIES_DATA_SOURCE, calories);

  const startTimeMillis = Math.round(powerData.minStartTimeNs / 1000000);
  const endTimeMillis = Math.round(powerData.maxEndTimeNs / 1000000);
  const id = `${startTimeMillis}-${endTimeMillis}`;

  const session = {
    id,
    startTimeMillis,
    endTimeMillis,
    name: "Connected Bike Ride",
    description: "Connected Bike Ride",
    application: APPLICATION,
    activityType: 17, // spinning
  };

  const url = `https://www.googleapis.com/fitness/v1/users/me/sessions/${id}`;

  const res = await fetch(url, {
    method: "PUT",
    headers: buildHeaders(),
    body: JSON.stringify(session),
  });

  return res.ok;
};

export const getSessions = async () => {
  const endTime = new Date();
  const startTime = subDays(endTime, 7);
  const url = `https://www.googleapis.com/fitness/v1/users/me/sessions?startTime=${startTime.toISOString()}&endTime=${endTime.toISOString()}`;

  const res = await fetch(url, {
    method: "GET",
    headers: buildHeaders(),
  });

  const json = await res.json();
  return json.session;
};

export const getHistory = async () => {
  const allSessions = await getSessions();

  const sessions = allSessions.filter(
    (s) => s.application.name === APPLICATION.name
  );

  const data = Promise.all(sessions.map((session) => getDataSets(session)));
  return data;
};

export const getDataSets = async (session) => {
  const power = await getDataSet(POWER_DATA_SOURCE, session);
  const heartRate = await getDataSet(HEART_RATE_DATA_SOURCE, session);
  const cadence = await getDataSet(CADENCE_DATA_SOURCE, session);

  return { session, dataSets: { power, heartRate, cadence } };
};

export const getDataSet = async (baseDataSource, session) => {
  const dataSource = await getDataSource(baseDataSource);
  const startNs = session.startTimeMillis * 1000000;
  const endNs = session.endTimeMillis * 1000000;

  const url = `https://www.googleapis.com/fitness/v1/users/me/dataSources/${dataSource.dataStreamId}/datasets/${startNs}-${endNs}`;

  const res = await fetch(url, {
    method: "GET",
    headers: buildHeaders(),
  });

  const json = await res.json();
  return json;
};
