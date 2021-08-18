import React,{useEffect,useState,useContext} from 'react';
import { UserContext } from '../../App';
import { Link } from 'react-router-dom';
const Profile =()=> {
  const [mypics,setPics] = useState([])
  const {state,dispatch} =  useContext(UserContext)
  useEffect(()=>{
    fetch('/mypost',{
    headers:{
      "Authorization":"Bearer "+localStorage.getItem("jwt")}
    }).then(res=>res.json())
    .then(result=>{
      setPics(result.mypost)
    })
  },[])
    return (
    <div style={{maxWidth:"550px", margin:"0px auto"}} >
          <div style={{
            display: 'flex',
            margin: '18px 0px',
            borderBottom : "1px solid gray"
          }}>
            <div style={{
              display: "flex",
              justifyContent:"space-around",
              
            }}/>
          <div>
            <img style={{width:"160px",height:"160px",borderRadius:"9999px"} }
            src={state?state.profilePic:""} key="1">
            </img>
            </div>
          <div>
            <h4>
              {state?state.name:"loading"}
            </h4>
            <h6>
            <Link to="/change">
            <i className="material-icons" >edit</i>Edit Profile</Link>
            </h6>
            <div style={{display:'flex',justifyContent:"space-between",width:"108%"}}>
              <h5>{mypics.length} posts</h5>
              {state?
              <h5><Link to={'/profile/'+state._id+'/followers'}>
                {state?state.followers.length:"0"}followers
                </Link>
                </h5>:"loading..."
              }{
                state?
              <h5>
                <Link to={'/profile/'+state._id+'/following'}>
                {state?state.following.length:"0"} following
                </Link>
                </h5> : "loading..."}
            </div>
            </div> 
          </div>
          <div className="gallery card-image" key={state?state._id : "6"}>
              {mypics.map(item=>{
                return(
                <div className="card home-card like-post z-depth-1" style={{width:'85%',display:"flex",flexDirection:'column',alignContent:'stretch',height:"50%", maxWidth:"100%"}}>
                  <Link to = {"/"+state._id+'/post/'+item._id}>  
                <div className="name">
                  <img style={{width:"40px",height:"40px",borderRadius:"9999px"} }
                  src={state?state.profilePic:""} key="1"></img> 
                <span style={{fontFamily:`TwitterChirp, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`, fontSize:"15px",fontWeight:"600",marginLeft:"5px",marginTop:"0",WebkitJustifyContent:"space-evenly"}}> @{state.name}</span>
                  </div>  
                <img key={item._id} draggable="true" className ="float-child" src={item.photo} alt={item.title} style={{height:"349px",width:"100%"}}></img>
                  </Link>
                </div>
              )
            })  
          }
          </div>
          </div>
  )
}
export default Profile