export let uploadPingData = async (uploadData) => {
    await fetch('api/sendPing', {
        method: 'POST',
        body: JSON.stringify(uploadData),
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

export let login = async (username, password) => {
    await fetch('api/login', {
        method: 'POST',
        headers: {
            Authorization: 'Basic ' + btoa(username + ':' + password),
        },
    });
};
