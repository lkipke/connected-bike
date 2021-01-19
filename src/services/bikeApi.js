//let host = 'http://localhost:9000/';
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
