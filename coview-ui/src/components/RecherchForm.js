import React, { Component } from 'react';
import axios from 'axios';

class RechercheForm extends Component {
  state = { nbAeroports: '', nbPopulation: '', nbJours: '', nbCases: '' };

  onChangeHandler = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  analyseDonnees = (e) => {
    e.preventDefault();
    const header = {
      headers: {
        'Content-type': 'application/json',
      },
    };

    axios
      .get(
        `/api/model/predict/${this.state.nbJours}&${this.state.nbAeroports}&${this.state.nbPopulation}`,
        header
      )
      .then((res) => {
        this.setState({ nbCases: res.data.cases });
      });
  };

  render() {
    return (
      <div>
        <h1 style={{ borderBottom: '1px solid black' }}>CoView</h1>
        <div id='container'>
          <div class='row'>
            <div class='column' style={{ background: '#aaa;' }}>
              <h3>Nombre d'aéroport</h3>
              <input
                type='number'
                id='nbAeroports'
                placeholder="Nombre d'aéroport"
                onChange={this.onChangeHandler}
              />
            </div>
            <div class='column' style={{ background: '#bbb;' }}>
              <h3>Nombre de personnes</h3>
              <input
                type='number'
                id='nbPopulation'
                placeholder='Nombre de personnes'
                onChange={this.onChangeHandler}
              />
            </div>
            <div class='column' style={{ background: '#ccc;' }}>
              <h3>Nombre de jours</h3>
              <input
                type='number'
                id='nbJours'
                placeholder='Nombre de jours'
                onChange={this.onChangeHandler}
              />
            </div>
          </div>
          <div className='btnAnalyser'>
            <button id='btnAnalyser' onClick={this.analyseDonnees}>
              Analyser
            </button>
          </div>
        </div>
        <div className='contentView'>
          <div className='divCas'>
            <h1>Nombre de cas estimés : </h1>
            <div className='compteurCas'>
              <span style={{ color: '#aaa' }}>
                {this.state.nbCases === ''
                  ? '####'
                  : Math.floor(this.state.nbCases)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RechercheForm;
