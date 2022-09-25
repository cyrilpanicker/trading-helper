module.exports = function(kc, apiSecret, addNote){
    return async (req, res) => {
        try {
            const response = await kc.generateSession(req.body.requestToken, apiSecret);
            if (!response.access_token) {
                addNote('error occurred while fetching access token')
                res.status(500).send({ error: 'error occurred while fetching access token' })
            } else {
                try {
                    await kc.setAccessToken(response.access_token)
                } catch (error) {
                    addNote('error occurred while setting access token', error)
                    res.status(500).send({ error: error ? error.message : 'error occurred while setting access token' })
                    return;
                }
                addNote('access token set successfully - authorization successful')
                res.send({ data: response.access_token })
            }
        } catch (error) {
            addNote('error occurred while fetching access token', error)
            res.status(500).send({ error: error ? error.message : 'error occurred while fetching access token' })
        }
    }
};