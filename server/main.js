require('dotenv').config();
const express = require('express');
const KiteConnect = require("kiteconnect").KiteConnect;
const bodyParser = require('body-parser');
const addNote = require('./notes').addNote
const getNotes = require('./notes').getNotes
const addNoteFromClient = require('./notes').addNoteFromClient
const fetchAndSetAccessToken = require('./fetchAndSetAccessToken')
const placeOrder = require('./placeOrder')

if (!process.env.KITE_API_KEY) {
    throw new Error('environment variable KITE_API_KEY is not set')
}

if (!process.env.KITE_API_SECRET) {
    throw new Error('environment variable KITE_API_SECRET is not set')
}

const app = express();
const port = 3001;
const { KITE_API_KEY, KITE_API_SECRET } = process.env;

const kc = new KiteConnect({ api_key: KITE_API_KEY });

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('trading-helper server is functional');
});

app.post('/fetch-and-set-access-token', fetchAndSetAccessToken(kc, KITE_API_SECRET, addNote));

app.post('/place-order', placeOrder(kc, addNote));

app.get('/get-notes', getNotes)

app.post('/add-note', addNoteFromClient)

app.listen(port, () => {
    addNote(`trading-helper server listening on port ${port}`)
});