const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const User = mongoose.model("User")
const jwt = require('jsonwebtoken')
const  requireLogin = require('../middleware/requireLogin')
const nodemailer = require('nodemailer')
const sendGridTransport = require('nodemailer-sendgrid-transport')
const {JWT_SECRET,SENDGRID_API,EMAIL_URL,LINK} = require('../config/keys')
const transporter = nodemailer.createTransport(sendGridTransport({
  auth : {
    api_key : SENDGRID_API
  }
}))
router.post('/signup',(req,res)=>{
  const {name,email,password} = req.body
  if(!email || !password || !name){
    return res.status(422).json({error : "please add all the fields"})
  }
  User.findOne({email : email})
  .then((savedUser)=>{
    if(savedUser){
      return res.status(422).json({error : "user already exist"})
    }
    bcrypt.hash(password,12)
      .then(hashedpassword=>{
        const user = new User ({
          email,
          password:hashedpassword,
          name
        })
        user.save().then(user=>{
          transporter.sendMail({
            to:user.email,
            from : "sheevam1101@gmail.com",
            subject : "signup successfull",
            html:"<h1>Welcome to Nakli-Instagram</h1>"
          }).then(()=>{
            console.log("sent")
          }).catch((err)=>{
            console.log("error")
            console.log(err)
          })
          
            res.json({message : "saved successfully"})
        })
        .catch(error=>{
          console.log(error)
        })
      })
      }).catch(error=>{
        console.log(error)
      })
    
})

router.post('/signin',(req,res)=>{
  const {email,password} = req.body
  if(!email || !password){
     return res.status(422).json({error:"please add email or password"})
  }
  User.findOne({email:email})
  .then(savedUser=>{
      if(!savedUser){
         return res.status(422).json({error:"Invalid Email or password"})
      }
      bcrypt.compare(password,savedUser.password)
      .then(doMatch=>{
          if(doMatch){
              // res.json({message:"successfully signed in"})
             const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
             const {_id,name,email,followers,following,profilePic} = savedUser
             res.json({token,user:{_id,name,email,followers,following,profilePic}})
          }
          else{
              return res.status(422).json({error:"Invalid Email or password"})
          }
      })
      .catch(err=>{
          console.log(err)
      })
  })
})

router.post('/reset-password',(req,res)=>{
  crypto.randomBytes(32,(err,buffer)=>{
    if(err){
      console.log(err)
      return res.status(422).json({error : "Something Gone Wrong"});
    }
    const token = buffer.toString("hex")
    User.findOne({email: req.body.email})
    .then(user=>{
      if(!user){
        return res.status(422).json({error : "User Doesn't exist"})
      }
      user.resetToken = token
      user.expireToken = Date.now() + 300000
      user.save().then((result)=>{
        transporter.sendMail({
          to : user.email,
          from : EMAIL_URL,
          subject : "password-reset",
          html : `
          <p> Someone requested for your password-reset </p>
          <h4>Click this <a href="${LINK}reset/${token}">link</a> to reset your password </h4>
          `
        })
            res.status(201).json({
            message : "check your email"
        })
      })
    })
  })
})


router.post('/new-password',(req,res)=>{
  const newpassword = req.body.password
  const sentToken = req.body.token
  User.findOne({resetToken : sentToken,expireToken:{$gt:Date.now()}})
  .then(user=>{
    if(!user){
      return res.status(422).json({error : "Try again session expired"})
    }
    bcrypt.hash(newpassword,12).then(hashedpassword =>{
      user.password = hashedpassword,
      user.resetToken = undefined,
      user.expireToken = undefined
      user.save().then(savedUser=>{
        res.json({message : "Password Updated Successfully"})
      }).catch((err)=>{
        return res.status(422).json({error : "Please try again later"})
      })
    })
  }).catch((err)=>{
    console.log(err)
  })
})

module.exports = router