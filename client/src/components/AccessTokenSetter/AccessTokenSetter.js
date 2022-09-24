import { useEffect } from "react";
import './AccessTokenSetter.css';

const AccessTokenSetter = ({ setShowLoading, setNotesText }) => {
    useEffect(() => {
        (async () => {
            const urlSearchParams = new URLSearchParams(window.location.search);
            const params = Object.fromEntries(urlSearchParams.entries());
            if (params && params.request_token) {
                setShowLoading(true)
                try {
                    await fetch('/fetch-and-set-access-token', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ requestToken: params.request_token })
                    });
                    window.location = 'http://127.0.0.1:3000'
                } catch {
                    setShowLoading(false)
                }
                setShowLoading(false)
            } else {
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
        })()
    }, [setShowLoading, setNotesText]);
    return (
        <button className="access-token-setter">
            <a href={`https://kite.zerodha.com/connect/login?v=3&api_key=${process.env.REACT_APP_KITE_API_KEY}`}>
                <h2>authorize</h2>
            </a>
        </button>
    )
}

export default AccessTokenSetter;