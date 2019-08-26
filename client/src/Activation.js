import React, {Component} from 'react'
import {withPharma} from './PharmaProvider'
import { Link } from 'react-router-dom'
import axios from 'axios'
import CheckAnimation from './UncontrolledLottie.jsx'



class Activation extends Component{
    constructor(props){
        super(props)
        this.state = {
            id: '',
            toggle: false
        }
     }


    activateUser = (id) => {
        axios.get(`/user/by/${id}`).then(res=> {
            console.log(res)
            if(res.data.confirmed === false){
                const newUser = {confirmed: true}
                axios.put(`/user/activate/${id}`, newUser).then(res => {  
                 
            })
            }else{
                this.setState({toggle: true})
            }
        })
    }
  
    activate = () => {
        let arr = this.state.id.split('')
        arr.splice(0,12)
        let final = arr.join('')
        this.activateUser(final)
    }

    componentDidMount(){
        this.setState({
           id: this.props.history.location.pathname,
        }, this.activate)
    }

    render(){
        return(
            <div className = "contact">
                <h2 className = "activH1">{!this.state.toggle ? "Mulțumim!Contul este activat." : "Contul este activ."}</h2>
                <CheckAnimation/>
                <Link style = {{fontSize: '15pt', fontWeight: '900', marginTop: '15pt'}} to = "/pharma">Login</Link>
            </div>
        )
    }
}


export default withPharma(Activation)