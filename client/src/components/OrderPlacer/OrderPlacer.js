import { useState } from "react";
import './OrderPlacer.css';

const OrderPlacer = ({ defaultMaxLoss, setShowLoading, setNotesText }) => {
    const [maxLoss, setMaxLoss] = useState(defaultMaxLoss);
    const [exchange, setExchange] = useState('NSE');
    const [tradingsymbol, setTradingsymbol] = useState('');
    const [higherPrice, setHigherPrice] = useState(0);
    const [lowerPrice, setLowerPrice] = useState(0);
    const fieldHandlerMap = {
        'maxLoss': setMaxLoss,
        'exchange': setExchange,
        'tradingsymbol': setTradingsymbol,
        'higherPrice': setHigherPrice,
        'lowerPrice': setLowerPrice
    };
    const handleFormChange = (event) => {
        const { id, value } = event.target;
        const handler = fieldHandlerMap[id];
        if (id === 'tradingsymbol' || id === 'exchange') {
            handler(value)
        } else {
            handler(+value);
        }
    }
    const selectText = (event) => {
        event.target.select();
    }
    const onSubmit = async (event, transaction_type) => {
        event.preventDefault();
        setShowLoading(true)
        try {
            const response = await fetch('/place-order', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    maxLoss,
                    exchange,
                    tradingsymbol,
                    transaction_type,
                    higherPrice,
                    lowerPrice
                })
            });
            await response.json();
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
                <label htmlFor="higherPrice">resistance:</label>
                <input
                    id="higherPrice"
                    className="higher-price"
                    type="number"
                    value={higherPrice}
                    onChange={handleFormChange}
                    onFocus={selectText}
                />
            </fieldset>
            <fieldset>
                <label htmlFor="lowerPrice">support:</label>
                <input
                    id="lowerPrice"
                    className="lower-price"
                    type="number"
                    value={lowerPrice}
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