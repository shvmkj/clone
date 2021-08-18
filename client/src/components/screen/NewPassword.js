import React,{useState,useContext,useReducer} from 'react';
import { Link,useHistory,useParams } from 'react-router-dom';
import M from "materialize-css"
const NewPassword =()=> {
  const [password,setPassword] = useState("")
  const history = useHistory()
  const {token} = useParams()
  const PostData = ()=>{
    fetch("/new-password",{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        password,
        token
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
        <input type="password" placeholder="enter new password" value={password} onChange = {(e)=>setPassword(e.target.value)}></input>
        <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={()=>PostData()}>
          Update Password
          </button>
          <Link to="/signup">Don't have an account?</Link>
      </div>
    </div>
  )
}
export default NewPassword