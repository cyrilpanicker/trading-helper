import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import AccessTokenSetter from './components/AccessTokenSetter';
import OrderPlacer from './components/OrderPlacer';
import PositionSizeFinder from './components/PositionSizeFinder';
import Loading from './components/Loading';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const {
  REACT_APP_POSITION_SIZE_FINDER_DEFAULT_MAX_LOSS: positionSizeFinderDefaultMaxLoss,
  REACT_APP_ORDER_PLACER_DEFAULT_MAX_LOSS: orderPlacerDefaultMaxLoss
} = process.env;

function App() {
  const [showLoading, setShowLoading] = useState(false)
  const [isAccessTokenSet, setIsAccessTokenSet] = useState(false)
  const toastInfo = (message) => {
    toast.info(message)
  }
  const toastError = (message) => {
    toast.error(message)
  }
  return (
    <div className="app">
      {/* <PositionSizeFinder defaultMaxLoss={positionSizeFinderDefaultMaxLoss || 100} /> */}
      <section className="place-order-section">
        {isAccessTokenSet ? (
          <OrderPlacer defaultMaxLoss={orderPlacerDefaultMaxLoss || 100} setShowLoading={setShowLoading} toastError={toastError} toastInfo={toastInfo} />
        ) : (
          <AccessTokenSetter setShowLoading={setShowLoading} toastError={toastError} toastInfo={toastInfo} setIsAccessTokenSet={setIsAccessTokenSet} />
        )}
      </section>
      <Loading show={showLoading} />
      <ToastContainer pauseOnHover={false} position="top-left" />
    </div>
  );
}

export default App;
