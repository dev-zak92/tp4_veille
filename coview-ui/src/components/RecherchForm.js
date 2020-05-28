import React from 'react';
const RechercheForm = ()=>{
    return(
        <div id="container">
            <div class="row">
                <div class="column" style={{background:'#aaa;'}}>
                    <h3>Nombre d'aeroport</h3>
                    <input type='text' id='inputText' placeholder='Entrez nombre aeroport' />
            </div>
            <div class="column" style={{background:'#bbb;'}}>
                    <h3>Nombre de population</h3>
                    <input type='text' id='inputText' placeholder='Entrez nombre de la population' />
            </div>
            <div class="column" style={{background:'#ccc;'}}>
                    <h3>Nombre de jours</h3>
                    <input type='text' id='inputText' placeholder='Entrez nombre de jours' />
            </div>
        </div>
        <div className="btnAnalyser">
            <button id='btnAnalyser'>Analyser</button>
        </div>

        
    </div>
    );
}
export default RechercheForm ;