import React, { Component } from 'react'
import axios from 'axios'
import ring from './Sound/Sound.mp3'


const openGeocoder = require('node-open-geocoder');
const PharmaContext = React.createContext()
const sound = new Audio(ring)



class PharmaProvider extends Component {
    constructor(){
        super()
        this.state = {
            user: JSON.parse(localStorage.getItem("user")) || {},
            token: localStorage.getItem("token") || "",
            toggle: true,
            username: '',
            password: '',
            password2: '',
            pharmaCode: '',
            city: JSON.parse(localStorage.getItem("city")) || '', // from geolocation..
            county: localStorage.getItem("county") || '',
            city2: '',
            city4:'',
            name: '',
            email: '',
            phone: '',
            time:'',
            medication: '',
            img:'',
            cities:['Oradea','Salonta','Marghita','Sacueni','Beius','Valea lui Mihai','Alesd','Stei','Vascau','Nucet'],
            messages: [],
            currentCity: '',
            send: true
            
        }
    }

    logout = () => {
        var answer = window.confirm("Esti sigur ca vrei sa iesi din cont?")
            if(answer){
                this.setState({
                    user:'',   
                    token: '',
                    toggle: true
                })
            localStorage.removeItem("user")
            localStorage.removeItem("token")
        }
    }

    signup = userInfo => {
        axios.post('/user/signup', userInfo).then(res => {
            const { token, user } = res.data
            localStorage.setItem("user", JSON.stringify(user))    //stores the token and the user  in local storage in case of page refresh...
            localStorage.setItem("token", token)
            this.setState({ user: user, token })
        })
        .catch(err => alert(err.response.data.errMsg))
    }

    login = userInfo => {
        axios.post('/user/login', userInfo).then(res => {
            const { token, user } = res.data          // when the token and user comes back from the database we store it in local storage
            localStorage.setItem("user", JSON.stringify(user))
            localStorage.setItem("token", token)
            this.setState({ user: user, token })
        })
        .catch(err => alert(err.response.data.errMsg))
    }

    editToggler = () => {
        this.setState(prevState => {
            return {
                toggle: !prevState.toggle, //toggle from login to signin
                username: '',
                password: '',
                password2: '',
                pharmaCode: ''
            }
        })
    }

    handleLogin = (e) => {   // login method, we send the username and password entered in the input fields to the database 
        e.preventDefault()
        const newUser = {
            username: this.state.username,
            password: this.state.password,
            
        }
        this.login(newUser) // we are receiving this function from the context and we call it here 
        this.setState({
            username: '',
            password: ''
        })
    }

    pharmaSignup = () => {
        this.getLocation()
        const newUser = {
            username: this.state.username,
            password: this.state.password,
            city: this.state.city4
        }
        this.signup(newUser)
        this.setState({
            username: '',
            password: '',
            password2:'',
            pharmaCode:'',
            city4: ''
        })
    }
    
    handleSignup = (e) => {
        e.preventDefault()
        this.state.password === this.state.password2 ?    
            this.state.pharmaCode === process.env.REACT_APP_CODE ?
                this.pharmaSignup()
                :
                this.state.pharmaCode === "" ? 
                    alert("Vã rugãm sa introduceti codul secret.")
                    :
                    alert("Cod  gresit!")
        :
        alert('Parolele nu sint identice!')
    }

    
    getLocation = () => {
        navigator.geolocation.getCurrentPosition(
        function(position) {
            openGeocoder().reverse(position.coords.longitude, position.coords.latitude)
                .end((err, res) => {       
                        if(err){
                            alert('Locatie necunuscuta')
                        }  
                        if(res){
                            localStorage.setItem("city", JSON.stringify(res.address.city))
                            localStorage.setItem("county", JSON.stringify(res.address.county))
                        }
                })
            }
        )
    }


    handleSubmit = (e) => {  // on submit we are sending a new booking object to the database
        e.preventDefault()
        const {name, email, phone, medication, img, county} = this.state
        const city = this.state.city.length ? this.state.city : this.state.city2
        const date = new Date()
        
        axios.post('/message', {date, name, email, phone, medication, img, city, county}).then(res => {
            console.log(res.data)
            alert(res.data +' Nume: '+ name +'  medicament: '+ medication)
        })
        
        this.setState({
            name: '',
            email: '',
            phone: '',
            medication: '',
            img: ''
        })
    }

    handleChange = (e) => {
        e.preventDefault()
        const { name, value } = e.target
        this.setState({
            [name]: value,
        }, this.getMessages(e.target.value))
        
    }  

    handleChange2 = (e) => {
        e.preventDefault()
        const { name, value } = e.target
        this.setState({
            [name]: value,
        })
    }  
    
    getMessages = (city) => {
        if(city.length){
            this.setState({currentCity:city}, this.getMessage2)
        }   
    }

    getMessage2 = () => {
        axios.get(`/message/2/${this.state.currentCity}`).then(res => {  
            this.setState({
                messages: res.data 
            })
        })
    }

    updateMessage = () => {
        axios.get(`/message/2/${this.state.currentCity}`).then(res => {  
            console.log(res.data.length, this.state.messages.length)
            if(res.data.length > this.state.messages.length){
                sound.play()
            }
            this.setState({
                messages: res.data 
            })
        })
    }

    onTakePhoto = (dataUri) => {
        this.setState({
           img: dataUri
        })
    }

    enlarge = (id) => {
        
        this.state.messages.map(item => item._id === id ? item.toggle = !item.toggle : item.toggle = true) 
        this.setState({
            send: !this.state.send
        })
        
        console.log(this.state.messages)
     }
    
    
    render() {
        return (
            <PharmaContext.Provider
                value={{
                    ...this.state,
                    handleToggle: this.handleToggle,
                    handleEdit:this.handleEdit,
                    logout: this.logout,
                    showMessages: this.showMessages,
                    handleDelete: this.handleDelete,
                    signup: this.signup,
                    login: this.login,
                    editToggler: this.editToggler,
                    handleLogin: this.handleLogin,
                    pharmaSignup: this.pharmaSignup,
                    handleSignup: this.handleSignup,
                    handleChange: this.handleChange,
                    handleChange2: this.handleChange2,
                    getLocation: this.getLocation,
                    handleSubmit: this.handleSubmit,
                    getMessages: this.getMessages,
                    updateMessage: this.updateMessage,
                    onTakePhoto: this.onTakePhoto,
                    enlarge: this.enlarge
                }}>
                {this.props.children}
            </PharmaContext.Provider>
        )
    }
}

export default PharmaProvider


export const withPharma = C => props => (
    <PharmaContext.Consumer>
        {value => <C {...props} {...value}/> }
    </PharmaContext.Consumer>
)

