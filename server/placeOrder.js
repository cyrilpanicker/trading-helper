
const getCurrentPrice = async (kc, addNote, res, exchange, tradingsymbol) => {
    const tradingsymbolWithExchange = `${exchange}:${tradingsymbol}`;
    let quoteResponse = null;
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
    return quoteResponse[tradingsymbolWithExchange].last_price;
}

const placeOrderFunctionCreator = (kc, addNote, res, exchange, tradingsymbol, quantity) => {
    return async (orderName, transaction_type, order_type, price, trigger_price) => {
        const orderParams = {
            exchange, tradingsymbol, transaction_type,
            quantity, product: 'MIS', order_type
        }
        if (price) {
            orderParams.price = price
        }
        if (trigger_price) {
            orderParams.trigger_price = trigger_price
        }
        let orderResponse = null
        addNote(`${orderName} order params`, orderParams, true)
        try {
            orderResponse = await kc.placeOrder('regular', orderParams)
        } catch (error) {
            addNote(`error occurred while placing ${orderName} order`, error)
            res.status(500).send({ error: error ? error.message : `error occurred while placing ${orderName} order` })
            return false
        }
        addNote(`${orderName} order placed`, orderResponse, true)
        return true
    }
}

module.exports = function (kc, addNote) {
    return async (req, res) => {
        const { exchange, tradingsymbol, transaction_type, higherPrice, lowerPrice, maxLoss } = req.body;
        const currentPrice = await getCurrentPrice(kc, addNote, res, exchange, tradingsymbol);
        if (!currentPrice) return
        const takeProfitPrice = transaction_type === 'BUY' ? higherPrice : lowerPrice;
        const stopLossPrice = transaction_type === 'BUY' ? lowerPrice : higherPrice;
        const quantity = Math.floor(maxLoss / Math.abs(currentPrice - stopLossPrice));
        const exitTransactionType = transaction_type === 'BUY' ? 'SELL' : 'BUY';
        const placeOrder = placeOrderFunctionCreator(kc, addNote, res, exchange, tradingsymbol, quantity);
        const entryOrderPlaced = await placeOrder('entry-order', transaction_type, 'MARKET', null, null)
        if (!entryOrderPlaced) return
        const stopLossOrderPlaced = await placeOrder('stop-loss', exitTransactionType, 'SL-M', null, stopLossPrice)
        if (!stopLossOrderPlaced) return
        const takeProfitOrderPlaced = await placeOrder('take-profit', exitTransactionType, 'LIMIT', takeProfitPrice, null)
        if (!takeProfitOrderPlaced) return
        addNote(`order placed: ${transaction_type} - ${tradingsymbol} - ${quantity} - ${currentPrice} - ${takeProfitPrice} - ${stopLossPrice}`)
        res.send({ data: 'order placed' })

    }
}