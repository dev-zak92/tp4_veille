import React from 'react';
import './App.css';
import RechercheForm from './components/RecherchForm';

class App extends React.Component {
  render() {
    return (
      <div className='App'>
        <header className='App-header'>
          <RechercheForm />
        </header>
      </div>
    );
  }
}

export default App;
