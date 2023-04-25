const mongoose = require("mongoose");
const express = require("express");
const Book = mongoose.model("Book")
const router = express.Router()
const requireLogin = require("../middleware/requireLogin")

router.post("/addbook",requireLogin,(req,res)=>{
    console.log(req.user)
    console.log(req.body)
    const {title,isbn,authorName,description,publishingDate,publisherName} = req.body
    const book = new Book({
        title:title,
        isbn:isbn,
        authorName:authorName,
        description:description,
        publishingDate:publishingDate,
        publisherName:publisherName,
        postedBy: req.user.username
    })
    book.save()
    .then(result=>{
        res.json({message:"Book added successfully"})
    })
    .catch(err=>console.log(err))
})

router.get("/availablebooks",requireLogin,(req,res)=>{
    Book.find({postedBy:req.user.username})
    .then(allbooks=>{
        res.json(allbooks)
    })
    .catch(err=>console.log(err))
})

router.post("/editbook",requireLogin,(req,res)=>{
    console.log(req.body)
    Book.findOne({title:req.body.title})
    .then(savedBook=>{
        res.json(savedBook)
    })
})

router.delete("/deletebook",requireLogin,(req,res)=>{
    Book.findByIdAndDelete({_id:req.body._id})
    .then(deletedBook=>{
        res.json({id:deletedBook._id,message:`${deletedBook.title} deleted successfully`})
    })
})


module.exports = router