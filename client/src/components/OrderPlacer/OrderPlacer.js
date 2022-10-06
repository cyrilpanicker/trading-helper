import { useState, useEffect } from "react";
import './OrderPlacer.css';

const OrderPlacer = ({ defaultMaxLoss, setShowLoading, setNotesText }) => {
    const [maxLoss, setMaxLoss] = useState(defaultMaxLoss);
    const [exchange, setExchange] = useState('NSE');
    const [tradingsymbol, setTradingsymbol] = useState('');
    const [takeProfitPrice, setTakeProfitPrice] = useState('');
    const [stopLossPrice, setStopLossPrice] = useState('');
    useEffect(() => {
        const iframeMessageListener = event => {
            const { from, symbol } = event.data;
            if(from === 'extension'){
                setTradingsymbol(symbol);
            }
        }
        window.addEventListener('message', iframeMessageListener);
        return () => {
            window.removeEventListener('message', iframeMessageListener);
        }
    },[]);
    const fieldHandlerMap = {
        'maxLoss': setMaxLoss,
        'exchange': setExchange,
        'tradingsymbol': setTradingsymbol,
        'takeProfitPrice': setTakeProfitPrice,
        'stopLossPrice': setStopLossPrice
    };
    const handleFormChange = (event) => {
        const { id, value } = event.target;
        fieldHandlerMap[id](value)
    }
    const selectText = (event) => {
        event.target.select();
    }
    const onSubmit = async (event, transaction_type) => {
        event.preventDefault();
        setShowLoading(true)
        try {
            await fetch('/place-order', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    maxLoss: +maxLoss,
                    exchange,
                    tradingsymbol,
                    transaction_type,
                    takeProfitPrice: +takeProfitPrice,
                    stopLossPrice: +stopLossPrice
                })
            });
        } catch {
            setShowLoading(false)
        }
        setShowLoading(false)
        setShowLoading(true)
        try {
            const response = await fetch('/get-notes', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            const notesContent = await response.json()
            setNotesText(notesContent.data)
        } catch (error) {
            console.log(error)
            setShowLoading(false)
        }
        setShowLoading(false)
    }
    return (
        <form className="order-placer" onSubmit={onSubmit} autoComplete="off">
            <h2>place order</h2>
            <fieldset>
                <label htmlFor="maxLoss">max-loss:</label>
                <input
                    id="maxLoss"
                    className="max-loss"
                    type="number"
                    value={maxLoss}
                    onChange={handleFormChange}
                    onFocus={selectText}
                />
            </fieldset>
            <fieldset>
                <label htmlFor="exchange">exchange:</label>
                <select id="exchange" value={exchange} onChange={handleFormChange}>
                    <option value="NSE">NSE</option>
                    <option value="BSE">BSE</option>
                </select>
            </fieldset>
            <fieldset>
                <label htmlFor="tradingsymbol">symbol:</label>
                <input
                    id="tradingsymbol"
                    className="trading-symbol"
                    value={tradingsymbol}
                    onChange={handleFormChange}
                    onFocus={selectText}
                />
            </fieldset>
            <fieldset>
                <label htmlFor="takeProfitPrice">take-profit:</label>
                <input
                    id="takeProfitPrice"
                    className="take-profit"
                    type="number"
                    value={takeProfitPrice}
                    onChange={handleFormChange}
                    onFocus={selectText}
                    placeholder="optional"
                />
            </fieldset>
            <fieldset>
                <label htmlFor="stopLossPrice">stop-loss:</label>
                <input
                    id="stopLossPrice"
                    className="stop-loss"
                    type="number"
                    value={stopLossPrice}
                    onChange={handleFormChange}
                    onFocus={selectText}
                />
            </fieldset>
            <fieldset className="cta-panel">
                <button className="buy-button" onClick={(event) => onSubmit(event, 'BUY')}>buy</button>
                <button className="sell-button" onClick={(event) => onSubmit(event, 'SELL')}>sell</button>
            </fieldset>
        </form>
    )
}

export default OrderPlacer