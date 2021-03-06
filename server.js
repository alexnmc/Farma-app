const express = require('express')
var forceSsl = require('force-ssl-heroku');
const app = express()
require ('dotenv').config()
const morgan = require('morgan')
const mongoose = require('mongoose')
const expressJwt = require("express-jwt");
const path = require("path")
const PORT = process.env.PORT || 8000
const secret = process.env.SECRET || "some secret passphrase here for local development"


app.use(forceSsl); // ssl certificate settings
app.use(express.json({limit: '50mb'})) // set larger data fro the photo
app.use(morgan('dev'))  
app.use("/api", expressJwt({secret})) 
app.use(express.static(path.join(__dirname, "client", "build")))


//routes
app.use("/user", require("./routes/user"))
app.use("/api/message", require("./routes/message"))
app.use("/messages", require("./routes/post"))
app.use("/mail", require('./routes/mail'))
app.use("/link", require('./routes/link'))



mongoose.connect(process.env.MONGODB_URI ||'mongodb://localhost:27017/messages', {useNewUrlParser: true}, () => {
    console.log('connect to the db captain!')    // name of database is messages
})
mongoose.set('useCreateIndex', true); // stops the error message...


app.use((err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
        res.status(err.status); //secret error 
    }
    return res.send({errMsg: err.message})
})


app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});


app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT} sir!`)
})