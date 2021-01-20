let host = '';
export let uploadPingData = async (uploadData) => {
    await fetch(`${host}api/sendPing`, {
        method: 'POST',
        body: JSON.stringify(uploadData),
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

export let logIn = async (username, password) => {
    return await fetch(`${host}api/login`, {
        method: 'POST',
        headers: {
            Authorization: 'Basic ' + btoa(username + ':' + password),
        },
    });
};

export let getUser = async (username, password) => {
    return await fetch(`${host}api/user`);
};

export let getSession = async (sessionId) => {
    return await fetch(`${host}api/session?id=${sessionId}`);
};

export let startSession = async (sessionId) => {
    return await fetch(`${host}api/session/start`, {
        method: 'POST',
        body: JSON.stringify({ sessionId, time: Date.now() }),
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

export let endSession = async (sessionId) => {
    return await fetch(`${host}api/session/end`, {
        method: 'POST',
        body: JSON.stringify({ sessionId, time: Date.now() }),
        headers: {
            'Content-Type': 'application/json',
        },
    });
};
