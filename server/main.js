require('dotenv').config();
const express = require('express');
const KiteConnect = require("kiteconnect").KiteConnect;
const bodyParser = require('body-parser');
const log = require('./logger').log
const fetchAndSetAccessToken = require('./fetchAndSetAccessToken').fetchAndSetAccessToken
const isAccessTokenSet = require('./fetchAndSetAccessToken').isAccessTokenSet
const placeOrder = require('./placeOrder')

const { KITE_API_KEY, KITE_API_SECRET } = process.env;

if (!KITE_API_KEY) {
    throw new Error('environment variable KITE_API_KEY is not set')
}

if (!KITE_API_SECRET) {
    throw new Error('environment variable KITE_API_SECRET is not set')
}

const app = express();
const port = 3001;

const kc = new KiteConnect({ api_key: KITE_API_KEY });

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('trading-helper server is functional');
});

app.post('/fetch-and-set-access-token', fetchAndSetAccessToken(kc, KITE_API_SECRET, log));

app.post('/place-order', placeOrder(kc, log));

app.get('/is-access-token-set', isAccessTokenSet);

app.listen(port, () => {
    log(`trading-helper server listening on port ${port}`)
});