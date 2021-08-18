import React,{useContext,useRef,useEffect,useState} from 'react'
import { Link,useHistory } from 'react-router-dom'
import {UserContext} from "../App"
import M from 'materialize-css'
const NavBar = ()=>{
  const searchmodal =useRef(null)
  const {state,dispatch} = useContext(UserContext)
  const [search,setSearch] = useState('')
  const [userDetails,setUserDetails] = useState([])
  const history = useHistory()
  useEffect(()=>{
    M.Modal.init(searchmodal.current)
  },[])
  const renderList = ()=>{
    if(state){
      return [
        <li key="1"><Link to="/search"><i data-target="modal1" className="large material-icons modal-trigger" style={{color:"black"}}>search</i></Link></li>,
        <li key="0"><Link to="/explore">Explore</Link></li>,
        <li key="2"><Link to="/create">Create Post</Link></li>,
        <li key="3"><Link to="/profile">Profile</Link></li>,
        <li key="4">
        <button className="btn #c62828 red darken-3" style={{marginRight:"20px"}}
        onClick={()=>{
          localStorage.clear();
          dispatch({type:"CLEAR"})
          history.push('/signin')
        } }
        >
          Logout
        </button>
        </li>
      ]
    }else{
      return [
        <li key="4"><Link to="/signin">Signin</Link></li>,
        <li key="5"><Link to="/signup">Signup</Link></li>
      ]
    }
  }
  const fetchUsers = (query)=>{
    setSearch(query)
    fetch("/search-users",{
      method:"post",
      headers:{
        "Authorization":"Bearer "+localStorage.getItem("jwt"),
        "Content-Type" : "application/json"
      },
      body:JSON.stringify({
        query
      })
    }).then(res=>res.json())
    .then(result=>{
      setUserDetails(result.user)
    })
  }
  return (<nav>
    <div className="nav-wrapper white">
      <Link to={state?"/":"/signin"} className="brand-logo left">Instagram</Link>
      <ul id="nav-mobile" className="right">
        {renderList()}
      </ul>
    </div>
    <div id="modal1" className="modal" ref={searchmodal} style={{color:"black"}}>
    <div className="modal-content">
      <input type="text" placeholder="search users" value={search} onChange={(event)=>fetchUsers(event.target.value)}></input>
      <ul className="collection">
      {userDetails.map(item=>{
        return <Link to ={item._id===state._id? "/profile/" : '/profile/'+item._id} key={item._id} onClick={()=>{
          M.Modal.getInstance(searchmodal.current).close()
        }}><li className="collection-item" key={item._id}>{item.name} <h6>{item.email}</h6></li></Link>
      })}
    </ul>
            
    </div>
    <div className="modal-footer">
      <button  className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch('')}>Clear</button>
    </div>
  </div>
  </nav>)
}
export default NavBar