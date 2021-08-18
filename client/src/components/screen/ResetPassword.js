import React,{useState,useContext,useReducer} from 'react';
import { Link,useHistory } from 'react-router-dom';
import M from "materialize-css"

const Reset =()=> {
  const [email,setEmail] = useState("")
  const history = useHistory()
  const PostData = ()=>{
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
      M.toast({html : "invalid email",classes:"#c62828 red darken-3"})
      return
    }
    fetch("/reset-password",{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        
        email
        })
    }).then(res=>res.json())
    .then(data=>{
      if(data.error){
        M.toast({html : data.error,classes:"#c62828 red darken-3"})
      }else{
        
        M.toast({html: data.message,classes:"#43a047 green darken-1"})
        history.push('/signin')
      }
    }).catch(err=>{
      console.log(err)
    })
}
  return (
    <div className="myCard">
      <div className="card auth-card input-field">
        <h2>Instagram</h2>
        <input type="text" placeholder="enter email" value={email} onChange = {(e)=>setEmail(e.target.value)}></input>
        
        <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={()=>PostData()}>
          Reset Password
          </button>
          
      </div>
    </div>
  )
}
export default Reset