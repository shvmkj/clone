import React,{useState,useContext} from 'react';
import { Link,useHistory } from 'react-router-dom';
import { UserContext } from '../../App';
import M from "materialize-css"
const Signin =()=> {
  const [name,setName] = useState("")
  const [password,setPassword] = useState("")
  const [email,setEmail] = useState("")
  const history = useHistory()
  const PostData = ()=>{
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
      M.toast({html : "invalid email",classes:"#c62828 red darken-3"})
      return
    }
    fetch("/signup",{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        name,
        password,
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
        <input type="text" placeholder="name" value={name} onChange = {(e)=>setName(e.target.value)}></input>
        <input type="text" placeholder="email" value={email} onChange = {(e)=>setEmail(e.target.value)}></input>
        <input type="password" placeholder="password" value={password} onChange = {(e)=>setPassword(e.target.value)}></input>
        <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={()=>PostData()}>
          Login
          </button>
          <h6>
          <Link to="/signin">Already have an account?</Link>
          </h6>
          <h6>
          <Link to='/reset'>Forgot Password</Link>
          </h6>
      </div>
    </div>
  )
}
export default Signin