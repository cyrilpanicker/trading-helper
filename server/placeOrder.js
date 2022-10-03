const symbolsWithSpecialCharacters = ['BAJAJ-AUTO', 'L&TFH', 'M&MFIN', 'M&M', 'NAM-INDIA', 'MCDOWELL-N'];
const specialCharacters = ['-', '&']

const getCurrentPrice = async (kc, addNote, exchange, tradingsymbol) => {
    const tradingsymbolWithExchange = `${exchange}:${tradingsymbol}`;
    let quoteResponse = null;
    try {
        quoteResponse = await kc.getQuote(tradingsymbolWithExchange);
    } catch (error) {
        addNote(`error occurred while fetching current price for ${tradingsymbol}`, error)
        return null
    }
    if (!quoteResponse[tradingsymbolWithExchange] || !quoteResponse[tradingsymbolWithExchange].last_price) {
        addNote(`error occurred while fetching current price for ${tradingsymbol}`)
        return null
    }
    addNote(`current price fetched successfully for ${tradingsymbol}`, null, true)
    return quoteResponse[tradingsymbolWithExchange].last_price;
}

const placeOrderFunctionCreator = (kc, addNote, exchange, tradingsymbol, quantity) => {
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
            return false
        }
        addNote(`${orderName} order placed`, orderResponse, true)
        return true
    }
}

module.exports = function (kc, addNote) {
    return async (req, res) => {
        let { exchange, tradingsymbol, transaction_type, higherPrice, lowerPrice, maxLoss } = req.body;
        if (tradingsymbol.indexOf('_') > -1) {
            for (let i = 0; i < specialCharacters.length; i++) {
                const testTradingSymbol = tradingsymbol.replace('_', specialCharacters[i]);
                if (symbolsWithSpecialCharacters.includes(testTradingSymbol)) {
                    tradingsymbol = testTradingSymbol;
                    break;
                };
            }
        }
        const currentPrice = await getCurrentPrice(kc, addNote, exchange, tradingsymbol);
        if (!currentPrice) {
            res.status(500).send()
            return
        }
        const takeProfitPrice = transaction_type === 'BUY' ? higherPrice : lowerPrice;
        const stopLossPrice = transaction_type === 'BUY' ? lowerPrice : higherPrice;
        const quantity = Math.floor(maxLoss / Math.abs(currentPrice - stopLossPrice));
        const exitTransactionType = transaction_type === 'BUY' ? 'SELL' : 'BUY';
        const placeOrder = placeOrderFunctionCreator(kc, addNote, exchange, tradingsymbol, quantity);
        const entryOrderPlaced = await placeOrder('entry-order', transaction_type, 'MARKET', null, null)
        if (!entryOrderPlaced) {
            res.status(500).send()
            return
        }
        const stopLossOrderPlaced = placeOrder('stop-loss', exitTransactionType, 'SL-M', null, stopLossPrice)
        let takeProfitOrderPlaced = null;
        if (takeProfitPrice) {
            takeProfitOrderPlaced = placeOrder('take-profit', exitTransactionType, 'LIMIT', takeProfitPrice, null)
        }
        const exitOrdersPlaced = await Promise.all([stopLossOrderPlaced, takeProfitOrderPlaced]);
        if (!exitOrdersPlaced[0] || (takeProfitPrice && !exitOrdersPlaced[1])) {
            res.status(500).send()
            return
        }
        addNote(`order placed: ${transaction_type} - ${tradingsymbol} - ${quantity} - ${currentPrice} - ${takeProfitPrice ? takeProfitPrice : 'NA'} - ${stopLossPrice}`)
        res.send({ data: 'order placed' })

    }
}