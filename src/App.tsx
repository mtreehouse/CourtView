import React from 'react';
import { CourtGrid } from 'features/courtgrid/CourtGrid';
import './App.css';
import { useSelector } from 'react-redux'
import { isLoadingState } from 'app/slices/spinnerSlice';
import { HashLoader } from 'react-spinners'
function App() {
  const isLoading = useSelector(isLoadingState);

  return (
    <div className="App">
      <HashLoader loading={isLoading} size={80} color="#36d7b7" cssOverride={{
        width:"100%",
        height:"100%",
        position: "absolute",
        zIndex: "999"
      }}/>
      <header className="App-header">
        <CourtGrid />
      </header>
    </div>
  );
}

export default App;
