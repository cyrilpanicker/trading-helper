import { useEffect } from "react";
import './AccessTokenSetter.css';

const AccessTokenSetter = ({ setShowLoading, toastError, toastInfo, setIsAccessTokenSet }) => {
    useEffect(() => {
        (async () => {
            const urlSearchParams = new URLSearchParams(window.location.search);
            const params = Object.fromEntries(urlSearchParams.entries());
            if (params && params.request_token) {
                setShowLoading(true)
                try {
                    const response = await fetch('/fetch-and-set-access-token', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ requestToken: params.request_token })
                    });
                    const responseData = await response.json()
                    if(responseData.error){
                        toastError(responseData.error)
                        return
                    }
                    if(responseData.data !== 'success'){
                        toastError('error occurred while fetching or setting access token')
                        return
                    }
                    window.location = 'http://127.0.0.1:3000'
                } catch {
                    setShowLoading(false)
                    toastError('error occurred while fetching or setting access token')
                }
                setShowLoading(false)
            } else {
                setShowLoading(true)
                try{
                    const response = await fetch('/is-access-token-set', {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                        }
                    });
                    const responseData = await response.json()
                    setIsAccessTokenSet(responseData.data)
                }catch{
                    setShowLoading(false)
                }
                setShowLoading(false)
            }
        })()
    }, []);
    return (
        <button className="access-token-setter">
            <a href={`https://kite.zerodha.com/connect/login?v=3&api_key=${process.env.REACT_APP_KITE_API_KEY}`}>authorize</a>
        </button>
    )
}

export default AccessTokenSetter;