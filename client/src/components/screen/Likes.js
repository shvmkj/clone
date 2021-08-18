import React,{useEffect,useState, useContext} from 'react'
import { UserContext } from '../../App'
import {useLocation,Link} from "react-router-dom"
function Likes() {
  const [data,setData] = useState([])
  const {state,setState} = useContext(UserContext)
  const location = useLocation().pathname
  console.log(location)
  useEffect(()=>{
    fetch(location,{
      method:"GET",
      headers:{
        "Authorization" : "Bearer "+localStorage.getItem("jwt"),
        "Content-Type" : "/application/json"
      }
    }).then(res=>res.json())
    .then((res)=>{
      console.log(res)
      setData(res)
    })
  },[])
  return (
    <div className="modal-content">
      
       <ul className="collection">
      {data.map(item=>{
        return <Link to ={state._id===item._id?'/profile':'/profile/'+item._id} key={item._id}>
          <li className="collection-item bold" key={item._id}>{item.name} <h6>{item.email}</h6></li></Link>
      })}
    </ul>
    </div>
  )
}

export default Likes
