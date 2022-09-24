import { useState, useEffect } from "react";
import './PositionSizeFinder.css'

export default function PositionSizeFinder({ defaultMaxLoss }) {
    const [maxLoss, setMaxLoss] = useState(defaultMaxLoss);
    const [price1, setPrice1] = useState(0);
    const [price2, setPrice2] = useState(0);
    const [positionSize, setPositionSize] = useState(0);
    useEffect(() => {
        if (price1 > price2) {
            setPositionSize(Math.floor(maxLoss / (price1 - price2)));
        } else {
            setPositionSize(0);
        }
    }, [maxLoss, price1, price2]);
    function handleFormChange(event) {
        const { id, value } = event.target;
        switch (id) {
            case "max-loss":
                setMaxLoss(+value);
                break;
            case "price-1":
                setPrice1(+value);
                break;
            case "price-2":
                setPrice2(+value);
                break;
            default:
        }
    }
    function selectText(event) {
        event.target.select();
    }
    return (
        <form className="position-size-finder">
            <h2>find position size</h2>
            <fieldset>
                <label htmlFor="max-loss">max-loss:</label>
                <input
                    id="max-loss"
                    className="max-loss"
                    type="number"
                    value={maxLoss}
                    onChange={handleFormChange}
                    onFocus={selectText}
                />
            </fieldset>
            <fieldset>
                <label htmlFor="price-1">higher-price:</label>
                <input
                    id="price-1"
                    className="price-1"
                    type="number"
                    value={price1}
                    onChange={handleFormChange}
                    onFocus={selectText}
                />
            </fieldset>
            <fieldset>
                <label htmlFor="price-2">lower-price:</label>
                <input
                    id="price-2"
                    className="price-2"
                    type="number"
                    value={price2}
                    onChange={handleFormChange}
                    onFocus={selectText}
                />
            </fieldset>
            <fieldset>
                <label htmlFor="position-size">position-size:</label>
                <input
                    id="position-size"
                    className="position-size"
                    type="number"
                    value={positionSize}
                    readOnly
                    onFocus={selectText}
                />
            </fieldset>
        </form>
    );
}