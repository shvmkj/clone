const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post")
const User = mongoose.model("User")

router.get('/user/:id',requireLogin,(req,res)=>{
  User.findOne({_id:req.params.id})
  .select("-password")
  .then(user=>{
    Post.find({postedBy : req.params.id})
    .populate("postedBy","_id name")
    .exec((err,posts)=>{
      if(err){
        return res.status(422).json({error : err})
      }else{
        res.json({user,posts})
      }
    })
  })
})
router.put('/follow',requireLogin,(req,res)=>{
  User.findByIdAndUpdate(req.body.followId,{
      $push:{followers:req.user._id}
  },{
      new:true
  },(err,result)=>{
      if(err){
          return res.status(422).json({error:err})
      }
    User.findByIdAndUpdate(req.user._id,{
        $push:{following:req.body.followId}
    },{new:true}).select("-password").then(result=>{
        res.json(result)
    }).catch(err=>{
        return res.status(422).json({error:err})
    })
  }
  )
})
router.put('/unfollow',requireLogin,(req,res)=>{
  User.findByIdAndUpdate(req.body.unfollowId,{
    $pull:{followers:req.user._id}
  },{new:true},(err,result)=>{
    if(err){
      return res.status(422).json({error : err})
    }
    User.findByIdAndUpdate(req.user._id,{
      $pull:{following : req.body.unfollowId}
    },{new:true}).select('-password').then(result=>{
      res.json(result)
    }).catch(err=>{
      return res.status(422).json({error : err})
    })
  }).select("-password")
})

router.put('/uploadpic',requireLogin,(req,res)=>{
  const {profilePic} = req.body
  if(!profilePic){
    return res.status(422).json({error : "Please add pic to be uploaded"})
  }
  User.findByIdAndUpdate(req.user._id,{$set:{profilePic:req.body.profilePic}},{new:true},(err,result)=>{
    if(err){
      return res.status(422).json({error: "pic cannot post"})
    }
    console.log("result",result, req.body.profilePic)
    res.json(result)
  })
})

router.post('/search-users',requireLogin,(req,res)=>{
  let userPattern = new RegExp("^"+req.body.query)
  User.find({email : {$regex:userPattern}})
  .select("_id name email")
  .then(user=>{
    res.json({user})
  }).catch((err)=>{
    console.log(err)
  })
})
router.get('/profile/:id/followers',requireLogin,(req,res)=>{
  User.find({_id:req.params.id})
  .populate("followers","_id name email")
  .select("-password")
  .then(userfollowers=>{
    return res.status(202).json(userfollowers)
  }).catch((err)=>{
    console.log(err)
  })
})
router.get('/profile/:id/following',requireLogin,(req,res)=>{
  User.find({_id:req.params.id})
  .populate("following","_id name email")
  .select("-password")
  .then(userfollowers=>{
    return res.status(202).json(userfollowers)
  }).catch((err)=>{
    console.log(err)
  })
})
module.exports = router