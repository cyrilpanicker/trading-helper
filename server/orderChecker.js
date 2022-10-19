const _ = require("lodash");
const KiteTicker = require("kiteconnect").KiteTicker;

const { KITE_API_KEY: api_key } = process.env

module.exports = (log, kc, access_token) => {
    const ticker = new KiteTicker({ api_key, access_token });
    ticker.autoReconnect(true, 10000, 5);
    ticker.connect();
    ticker.on("connect", async () => {
        log('ticker connected successfully')
    });
    ticker.on('disconnect', () => {
        log('ticker disconnected')
    })
    ticker.on("noreconnect", () => {
        log("ticker reconnection failed");
    });
    ticker.on("reconnect", () => {
        log(`ticker reconnecting`);
    });
    ticker.on('error', () => {
        log('ticker connection closed with error')
    })
    ticker.on('close', () => {
        log('ticker connection closed')
    })
    ticker.on('order_update', _.debounce(async () => {
        try {
            const ordersResponse = await kc.getOrders();
            const pendingOrders = ordersResponse.filter(({ status, product }) => (product === 'MIS' && (status === 'OPEN' || status === 'TRIGGER PENDING')));
            if (!pendingOrders.length) return;
            const positionsResponse = await kc.getPositions();
            const positionValuesMap = _.keyBy(positionsResponse.net, 'tradingsymbol');
            for (let i = 0; i < pendingOrders.length; i++) {
                if (positionValuesMap[pendingOrders[i].tradingsymbol].quantity === 0) {
                    await kc.cancelOrder('regular', pendingOrders[i].order_id)
                    log(`pending order ${pendingOrders[i].order_id} for ${pendingOrders[i].tradingsymbol} cancelled`, null, true)
                }
            }
        } catch (error) {
            log('error ocurred while checking and cancelling pending orders', error, true)
        }
    }, 2000))
}