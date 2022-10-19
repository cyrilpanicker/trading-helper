const startOrderChecking = require('./orderChecker')

let accessToken = null

module.exports.fetchAndSetAccessToken = function (kc, apiSecret, log) {
    return async (req, res) => {
        try {
            const response = await kc.generateSession(req.body.requestToken, apiSecret);
            if (!response.access_token) {
                log('error occurred while fetching access token')
                res.status(500).send({ error: 'error occurred while fetching access token' })
            } else {
                try {
                    await kc.setAccessToken(response.access_token)
                    accessToken = response.access_token
                } catch (error) {
                    accessToken = null
                    log('error occurred while setting access token', error)
                    res.status(500).send({ error: error ? error.message : 'error occurred while setting access token' })
                    return;
                }
                log('access token set successfully - authorization successful')
                startOrderChecking(log, kc, response.access_token)
                res.send({ data: 'success' })
            }
        } catch (error) {
            log('error occurred while fetching access token', error)
            res.status(500).send({ error: error ? error.message : 'error occurred while fetching access token' })
        }
    }
};

module.exports.isAccessTokenSet = (req, res) => {
    if (!accessToken) {
        res.send({ data: false })
    } else {
        res.send({ data: true })
    }
}