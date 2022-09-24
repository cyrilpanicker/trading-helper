
module.exports = function (kc, addNote) {
    return async (req, res) => {
        const { exchange, tradingsymbol, transaction_type, higherPrice, lowerPrice, maxLoss } = req.body;
        let quoteResponse = null;
        let mainOrderResponse = null;
        const tradingsymbolWithExchange = `${exchange}:${tradingsymbol}`;
        try {
            quoteResponse = await kc.getQuote(tradingsymbolWithExchange);
        } catch (error) {
            addNote('error occurred while fetching current price', error)
            res.status(500).send({ error: error ? error.message : 'error occurred while fetching current price' })
            return
        }
        if (!quoteResponse[tradingsymbolWithExchange] || !quoteResponse[tradingsymbolWithExchange].last_price) {
            addNote('error occurred while fetching current price')
            res.status(500).send({ error: 'error occurred while fetching current price' })
            return
        }
        addNote('current price fetched successfully', null, true)
        const currentPrice = quoteResponse[tradingsymbolWithExchange].last_price;
        let quantity = transaction_type === 'BUY' ? maxLoss / (currentPrice - lowerPrice) : maxLoss / (higherPrice - currentPrice);
        quantity = Math.floor(quantity);
        const mainOrderParams = {
            exchange,
            tradingsymbol,
            transaction_type,
            quantity,
            product: 'MIS',
            order_type: 'MARKET'
        }
        addNote('main order params', mainOrderParams, true)
        try {
            mainOrderResponse = await kc.placeOrder('regular', mainOrderParams)
        } catch (error) {
            addNote('error occurred while placing main order', error)
            res.status(500).send({ error: error ? error.message : 'error occurred while placing main order' })
            return
        }
        addNote('main order placed successfully', mainOrderResponse)
        res.send({ data: { quantity, currentPrice } })
    }
}