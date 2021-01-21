let host = '';

let wrappedFetch = async (path, data) => {
    return fetch(path, data).then((res) => res.json());
};

export let uploadPingData = async (uploadData) => {
    await wrappedFetch(`${host}api/sendPing`, {
        method: 'POST',
        body: JSON.stringify(uploadData),
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

export let logIn = async (username, password) => {
    return wrappedFetch(`${host}api/login`, {
        method: 'POST',
        headers: {
            Authorization: 'Basic ' + btoa(username + ':' + password),
        },
    });
};

export let getUser = async (username, password) => {
    return await wrappedFetch(`${host}api/user`);
};

export let getSession = async (sessionId) => {
    return await wrappedFetch(`${host}api/session?id=${sessionId}`);
};

export let startSession = async (sessionId) => {
    return await wrappedFetch(`${host}api/session/start`, {
        method: 'POST',
        body: JSON.stringify({ sessionId, time: Date.now() }),
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

export let endSession = async (sessionId) => {
    return await wrappedFetch(`${host}api/session/end`, {
        method: 'POST',
        body: JSON.stringify({ sessionId, time: Date.now() }),
        headers: {
            'Content-Type': 'application/json',
        },
    });
};
