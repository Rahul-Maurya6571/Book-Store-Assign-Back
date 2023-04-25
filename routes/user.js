const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const User = mongoose.model("User")
const jwt = require("jsonwebtoken")
const router = express.Router()
// const JWT_SECRET = "abcdef"
// const requireLogin = require("../middleware/requireLogin")

router.post("/register",(req,res)=>{
    console.log(req.body)
    const {username, password} = req.body 
    if(!username || !password){
        return res.status(422).json({error:"Please fill all the feilds"})
    }
    User.findOne({username:username})
    .then(savedUser=>{
        if(savedUser){
            return res.status(422).json({error:"username is already taken"})
        }
        else{
            bcrypt.hash(password,12)
            .then(hashedpass=>{
                const newUser = new User({
                    username:username,
                    password:hashedpass
                })
                newUser.save()
                .then(result=>{
                    res.json({message:`${username} registered successfully`})
                })
            })
        }
    })
})

router.post("/signin",(req,res)=>{
    const {username, password} = req.body 

    console.log(req.body)
    if(!username || !password){
        return res.status(422).json({error:"Please fill all the feilds"})
    }
    User.findOne({username:username})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(401).json({error:"Invalid username or password"})
        }
        else{
            bcrypt.compare(password,savedUser.password)
            .then(doMatch=>{
                if(!doMatch){
                    return res.status(401).json({error:"Invalid username or password"})
                }
                const token = jwt.sign({_id:savedUser._id},process.env.JWT_SECRET)
                const {_id,username} = savedUser
                return res.json({token:token,user:{_id,username},message:"successfully signed in"})
            })
        }
    })
})
module.exports=router