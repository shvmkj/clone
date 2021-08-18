const express = require('express')
const mongoose = require('mongoose')
const app = express()
const PORT = process.env.PORT || 5000
const {MONGOURL} = require('./config/keys')
mongoose.connect(MONGOURL,{
  useNewUrlParser:true,
  useUnifiedTopology:true
})
mongoose.connection.on('connected',()=>{
  console.log("connected to mongoose")
})
mongoose.connection.on('error',(err)=>{
  console.log("connecting error",err)
})
require('./models/user')
require('./models/post')

app.use(express.urlencoded({extended : true}))
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))
if(process.env.NODE_ENV==="production"){
  app.use(express.static('client/build'))
  const path = require('path')
  app.get("*",(req,res)=>{
      res.sendFile(path.resolve(__dirname,'client','build','index.html'))
  })
}
app.listen(PORT,()=>{
  console.log('server is runnig on ', PORT)
})