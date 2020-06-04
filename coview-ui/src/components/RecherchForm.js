import React from 'react';
class RechercheForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {nbAeroports:'',
                 nbPopulation:'',
                 nbJours:'',
                };
    }

handleInputAeroport(e){

if(e.target.validity.valid){
    switch(e.target.placeholder){
        case "#aeroport":
            console.log('Aeropor: ',e.target.value);
            this.setState({nbAeroports: e.target.value});        
         
            break;
        case "#population":
            this.setState({nbPopulation: e.target.value});        
            console.log('population: ',this.state.nbPopulation );
            break;
        case "#Jours":
            this.setState({nbJours: e.target.value});        
            console.log('Jours: ',this.state.nbJours );
            break;
    
}

}
}



onBtnAnalyseClicked(){
    this.props.callBackRequest(this.state.nbAeroports, this.state.nbPopulation, this.state.nbJours);
}

render(){
    return(
        <div id="container">
            <div class="row">
                <div class="column" style={{background:'#aaa;'}}>
                    <h3>Nombre d'aeroport</h3>
                    <input type='number' id='inputText' placeholder='#aeroport' onChange={this.handleInputAeroport.bind(this)} pattern="[0-9]*" />
            </div>
            <div class="column" style={{background:'#bbb;'}}>
                    <h3>Nombre de population</h3>
                    <input type='number' id='inputText' placeholder='#population' onChange={this.handleInputAeroport.bind(this)} />
            </div>
            <div class="column" style={{background:'#ccc;'}}>
                    <h3>Nombre de jours</h3>
                    <input type='number' id='inputText' placeholder='#jours' onChange={this.handleInputAeroport.bind(this)} />
            </div>
        </div>
        <div className="btnAnalyser">
            <button id='btnAnalyser' onClick={this.onBtnAnalyseClicked.bind(this)}>Analyser</button>
        </div>

        
    </div>
    );
}

}

export default RechercheForm ;