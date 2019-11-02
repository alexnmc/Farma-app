import React, {Component} from 'react'
import {withPharma} from './PharmaProvider'
import moment from 'moment'
import { FaUser } from 'react-icons/fa'


class PharmaPortal extends Component {
    constructor(props){
        super(props)
        
        this.state = {
           userCity: this.props.user.city,
           messages: this.props.messages,
           helpToggle: true
        }
    }

    
    componentDidMount(){
        this.props.getMessages(this.state.userCity)
        setInterval(this.props.updateMessage, 100000)
    }

    
    helpToggle = () => {
        this.setState({
            helpToggle: !this.state.helpToggle
        })
    }


    render(){
        
        let arr = this.props.messages

        arr.sort(function (a, b) {
            return new Date(b.time) - new Date(a.time)
        })  

        arr.sort(function (a, b) {
            return new Date(b.date) - new Date(a.date)
        })  
        
        const messages = arr.map(item =>{
            return(
                item.toggle ?
                
                <div className = "messageContainer" key = {item._id} style = {{backgroundColor: item.rezolvat ? "rgb(38, 55, 82)" : null}}>
                    <p className = "p1">Email: <a href = {`mailto:${item.email}`} style = {!item.rezolvat? {color: "blue"} : {color:'black'}}>{item.email}</a></p>
                    <p className = "p5">Tel: <a href = {`tel: ${item.phone}`} style = {!item.rezolvat? {color: "blue"} : {color:"black"}}>{`0${item.phone}`}</a></p> 
                    {item.img ? <img  onClick = {!item.rezolvat ? () => this.props.enlarge(item._id) : null} className = 'myImg' alt = '' src = {item.img} style = {item.rezolvat ? {cursor:'none'}: null}/> : <div style = {{width:'30pt', height: '20pt'}}></div>}
                    <p className = "p3" style = {item.rezolvat ?  {color: "black"} : null}><span>Cautã: </span>{item.medication}</p>
                    <p className = "p4"> {moment(item.date).format('MMMM Do YYYY, HH:mm:ss ')}</p>
                    <p className = 'rezolvat' onClick = {!item.rezolvat ? () => this.props.rezolvat(item._id, item.email) : null} style = {item.rezolvat ? {cursor:'none', color: "white"} : null}>{!item.rezolvat ? "închide" : "rezolvat"}</p>
                </div>

                :
                 
                <div className = "messageContainer" key = {item._id} style = {{position: 'relative' , backgroundColor : 'lightgrey'}}>
                    <p className = "p1">Email: <a  href = {`mailto:${item.email}`} style = {{color: "blue"}}>{item.email}</a></p>
                    <p className = "p5">Tel: <a  href = {`tel: ${item.phone}`} style = {{color: "blue"}}>{`0${item.phone}`}</a></p> 
                    <img    style = {document.documentElement.clientWidth < 1100 ?  
                                        {width: '100%' , height: '60vh', marginTop: '1%'} 
                                        : 
                                        {position: 'absolute' , border: "2px solid white", marginTop: '20pt', marginLeft: '40pt' , width: '320pt' , height: '300pt'}}  
                            onClick = {() => this.props.enlarge(item._id)} 
                            className = 'myImg' 
                            alt = '' 
                            src = {item.img}/>
                    <p className = "p33"></p>
                    {document.documentElement.clientWidth < 1000 ? <p className = "p3"><span>Cautã: </span>{item.medication}</p> : <p style = {{width: '300pt'}}></p>}
                    <p className = "p4"> {moment(item.date).format('MMMM Do YYYY, HH:mm:ss')}</p>
                    <p className = 'rezolvat'>închide</p>
                </div>
            )
        })

       
        return(
            <div className = 'pharmaport'>
                <div className = 'messageWrap'>
                <div style = {{margin: "auto" , width: "97%" , display:'flex', alignItems: 'center', justifyContent: 'space-evenly', marginBottom: '5pt'}}>
                    <p className = 'h1A' style = {{cursor: 'pointer' , color:"red"}}  onClick = {() => this.helpToggle()}>{this.state.helpToggle ? "utilizare" : "înapoi"}</p>
                    <div style = {{display: "flex"}}>
                        <FaUser />
                        <p className = 'h1A' style = {{marginLeft:'3pt'}}>{this.props.user.username}</p>
                    </div>
                </div>
                <div className = 'portalWrap'>
                    <div className = 'h1' style = {this.props.currentCity ? {opacity: 1} : {opacity:0}}>{this.props.messages.length === 1 ? '1 mesaj' : `${this.props.messages.length + ' mesaje'}`}</div>
                    <input type = "text" className = 'input2' list="mylist" placeholder = 'Alege orașul:' value = {this.props.currentCity} onChange={this.props.handleChange} required/>
                    <datalist id="mylist" >
                        {this.props.cities.map((city, index) => <option key={city} value={city} className = {index}>{city}</option>)}
                    </datalist>
                    <button className = "logout" onClick = {this.props.logout}>ieșire</button>
                </div>
                {this.state.helpToggle ? 
                    
                    <div>{messages}</div>

                    :

                    <div className = "pharmaport" style = {{marginTop: '15vh'}}>
                        <ul>
                            <li className = "help">Alegeți orașul în care doriți sa citiți mesaje</li>
                            <li className = "help">După rezolvarea unui mesaj dați click pe <span style = {{color: "red"}}>închide</span></li>
                            <li className = "help">Mesajele închise nu se pot re-deschide</li>
                            <li className = "help">Pentru a mãri poza din mesaj dați click pe pozã</li>
                        </ul>
                    </div>
                    }
                </div>
               
            </div>
        )
    }
}

export default  withPharma(PharmaPortal)