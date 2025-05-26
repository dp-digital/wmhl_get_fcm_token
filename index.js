const env = require ('dotenv');
const express = require('express');
const fs = require('fs');
const path = require('path');

//const decoded = Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT, 'base64').toString('utf-8');

const { GoogleAuth } = require('google-auth-library');

const app = express();
const port = process.env.PORT || 3000;

const filePath = path.join(__dirname, 'serviceAccount.json');

const auth = new GoogleAuth({
    keyFile: filePath,
    scopes  : ['https://www.googleapis.com/auth/firebase.messaging'],
});

async function getAccessToken() {
    const client = await auth.getClient();
    const { token } = await client.getAccessToken();
    return token;
}

app.get('/fcm-token', async (_req, res) => {
    try {
        const token = await getAccessToken();
        res.json({ access_token: token });
    } catch (err) {
        console.error('Token generation error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.get('/', (_req, res) => {
    res.send('FCM Auth API');
});

app.listen(port, () =>
    console.log(`FCM auth API running on http://localhost:${port}`)
);

console.log('Starting server...');