import React from 'react';
import logo from './logo.svg';
import './App.css';
import ResultView from './components/ResultView';
import RechercheForm from './components/RecherchForm';
class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      isOk: false,
      nbAeroports: '',
      nbPopulation:'',
      nbJours:'',
    }
  }

  analyseDonnees(pAeroport, pPopulation, pJours){
    this.setState({nbAeroports: pAeroport, nbPopulation: pPopulation, nbJours: pJours});
}

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <RechercheForm callBackRequest={this.analyseDonnees.bind(this)}/>
        <ResultView props = {this.state}/>
        </header>
    
      </div>
    );
  }

}


export default App;
