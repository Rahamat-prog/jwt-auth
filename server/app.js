const express = require('express');
const authRouter = require("./router/authRouter");
const databaseConnected = require('./config/databaseConfig');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// instance of express 
const app = express()

// call the database connection 
databaseConnected();

// parse the data 
app.use(express.json());
// convert the cookies into json format 
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
     credentials: true
}
   
))

// prefix router 
app.use('/api/auth/', authRouter);


// initial server created
app.get('/', (req, res) => {
    res.status(200).json({
        data: "jwt auth server"     
    })
})



// exportt the app so we can use it in other file 
module.exports = app;
 

