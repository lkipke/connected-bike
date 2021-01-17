export let uploadPingData = async (uploadData) => {
    await fetch('/sendPing', {
        method: 'POST',
        body: JSON.stringify(uploadData),
        headers: {
            'Content-Type': 'application/json',
        },
    });
};
