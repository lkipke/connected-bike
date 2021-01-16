export let uploadPingData = async (uploadData) => {
    await fetch('http://localhost:9000/sendPing', {
        method: 'POST',
        body: JSON.stringify(uploadData),
        headers: {
            'Content-Type': 'application/json',
        },
    });
};
