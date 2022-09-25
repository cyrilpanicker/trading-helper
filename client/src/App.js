import { useState } from 'react';
import AccessTokenSetter from './components/AccessTokenSetter';
import OrderPlacer from './components/OrderPlacer';
import Notes from './components/Notes';
import PositionSizeFinder from './components/PositionSizeFinder';
import Loading from './components/Loading';
import './App.css';

function App() {
  const [showLoading, setShowLoading] = useState(false)
  const [notesText, setNotesText] = useState('')
  const handleNotesTextChange = (event) => {
    setNotesText(event.target.value);
  };
  return (
    <div className="app">
      <PositionSizeFinder defaultMaxLoss={200} />
      <section className="place-order-section">
        <OrderPlacer defaultMaxLoss={200} setShowLoading={setShowLoading} setNotesText={setNotesText} />
        <AccessTokenSetter setShowLoading={setShowLoading} setNotesText={setNotesText} />
      </section>
      <Notes text={notesText} onChange={handleNotesTextChange} setShowLoading={setShowLoading} />
      <Loading show={showLoading} />
    </div>
  );
}

export default App;
