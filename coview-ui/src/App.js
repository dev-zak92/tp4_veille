import React from 'react';
import logo from './logo.svg';
import './App.css';
import ResultView from './components/ResultView';
import RechercheForm from './components/RecherchForm';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <RechercheForm/>
      <ResultView/>
      </header>
  
    </div>
  );
}

export default App;
