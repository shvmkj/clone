import React,{useEffect,useState,useContext} from 'react';
import { Link,useLocation } from 'react-router-dom';

import { UserContext } from '../../App';
const Followers = ()=>{
  const{state,dispatch} = useContext(UserContext)
  const location = useLocation()
  const[data,setData] = useState([])
  useEffect(()=>{
     fetch(location.pathname,{
      method:"GET",
      headers:{
        "Content-Type" : "/application/json",
        "Authorization" : "Bearer "+localStorage.getItem("jwt")
      }
    }).then(res=>res.json())
    .then(result=>{
      console.log(result[0].followers)
      setData(result[0].followers)
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
export default Followers