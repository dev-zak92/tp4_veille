import React from 'react';
class ResultView extends React.Component{
    constructor(props){
        super(props)
    }


    render(){
        return(
            
            <div className="contentView">
                {/* conteneur qui contient tout les cas */}
                
                    {/*div de cas enregistrer*/}
                    <div className="divCas">
                        <h1>Cas Enregistrés:</h1>
                        <div className="compteurCas">
                            <span style={{color:'#aaa'}}>######</span>
                        </div>
                    </div>
                
                {/* div cas morts */}
                
                    <div className="divCas">
                        <h1>Décès:</h1>
                        <div className="compteurMorts">
                            <span style={{color:'#696969'}}>######</span>
                        </div>
                    </div>
                
                {/* div de cas guéris */}
                
                    <div className="divCas">
                        <h1>Cas rétablis:</h1>
                        <div className="compteurGueris">
                            <span style={{color:' #8ACA2B'}}>######</span>
                        </div>
                    </div>
                

            </div>
        );
    }
}
export default ResultView;