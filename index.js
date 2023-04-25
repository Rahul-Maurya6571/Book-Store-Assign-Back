const dotenv = require("dotenv")
dotenv.config()
const express = require("express")
const mongoose = require("mongoose")
const port =8000
const app = express()
const cors = require("cors")

mongoose.connect(process.env.MONGO_URI)
//models
require("./models/user")
require("./models/book")

//cors
app.use(express.json())
app.use(cors({
    origin:"https://book-stote-assign-front.onrender.com"
}))

//routes
app.use(require("./routes/user"))
app.use(require("./routes/post"))

mongoose.connection.on("connected",()=>{
    console.log("successfully connected with db")
})

mongoose.connection.on("error",()=>{
    console("can not connect wit db")
})
app.listen(port,()=>{
    console.log(`app is running on Port : ${port}`)
})