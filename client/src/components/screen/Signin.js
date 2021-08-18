import React,{useState,useContext,useReducer} from 'react';
import { Link,useHistory } from 'react-router-dom';
import M from "materialize-css"
import { UserContext } from '../../App';
const Signin =()=> {
  const {state,dispatch} = useContext(UserContext)
  const [password,setPassword] = useState("")
  const [email,setEmail] = useState("")
  const [user] = useState(UserContext)
  const history = useHistory()

  const PostData = ()=>{
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
      M.toast({html : "invalid email",classes:"#c62828 red darken-3"})
      return
    }
    fetch("/signin",{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        password,
        email
        })
    }).then(res=>res.json())
    .then(data=>{
      if(data.error){
        M.toast({html : data.error,classes:"#c62828 red darken-3"})
      }else{
        localStorage.setItem("jwt",data.token)
        localStorage.setItem("user",JSON.stringify(data.user))
        dispatch({type : "USER",payload:data.user})
        M.toast({html: "signed in success",classes:"#43a047 green darken-1"})
        history.push('/')
      }
    }).catch(err=>{
      console.log(err)
    })
  }
  return (
    <div className="myCard" style={{display:"flex"}}>
      <div className="card auth-card input-field">
        <h2>Instagram</h2>
        <input type="text" placeholder="email" value={email} onChange = {(e)=>setEmail(e.target.value)}></input>
        <input type="password" placeholder="password" value={password} onChange = {(e)=>setPassword(e.target.value)}></input>
        <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={()=>PostData()}>
          Login
          </button>
          <h6>
          <Link to="/signup">Don't have an account?</Link>
          </h6>
          <h6>
          <Link to='/reset'>Forgot Password</Link>
          </h6>
          
      </div>
    </div>
  )
}
export default Signin