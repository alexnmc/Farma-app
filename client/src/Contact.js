import React, {Component} from 'react'




class Home extends Component {
    constructor(props){
        super(props)
        this.state = {
            toggle: true,
            
        }
}


render(){
    return(
        <div className = "home">
            <div className = "imgWrap">
                <div  className = 'img2'></div>
                <h1 className = 'farmaup'>Farma - up</h1>
            </div>
            <h1 className = 'h3'> Gãsiti în cel mai scurt timp medicamentul sau produsul farmaceutic care cãutati!</h1>
            <h1 className = 'h3'>Cum functioneazã ? </h1>
            <h1 className = 'h3'> Completati formularul de pe pagina Cautã ca sa fiti contactat direct de farmaciile locale care ofera produsul.</h1>
            <h1 className = 'h3'> Farmaciile din reteaua noastrã asteaptã mesajul dumneavoastrã!.</h1>
            <h1 className = 'h2'>Contact: <br/><br/>Cristian Lazar <br/>  Telefon: 0773853041</h1>
            
        </div>
    )
}
}

export default Home