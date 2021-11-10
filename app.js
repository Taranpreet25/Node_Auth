const mongoose = require("mongoose")
const express = require("express")

const app = express()

const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

const cors = require("cors")
require("dotenv").config();

const port = process.env.PORT || 3001; 
const uri = process.env.MONGODB_CONNECTION_STRING;

// database connection
mongoose.connect(uri, {
    // useCreateIndex: true, 
    // useFindAndModify: false, 
    // useNewUrlParser: true, 
    // useUnifiedTopology: true 
})

const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDb database connection established successfully");
});


// using parsing middelware
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

// Import routes
const userRoutes = require("./routes/user")

// Using routes
app.use('/api', userRoutes)

app.listen(port, ()=> {
    console.log(`app is listning at http://localhost:${port}`);
});



