import React,{useEffect,useState,useContext} from 'react';
import { UserContext } from '../../App';
import {useParams,useLocation,Link} from 'react-router-dom'
const Profile =()=> {
  const [userProfile,setProfile] = useState(null)
  const {state,dispatch} =  useContext(UserContext)
  const {userId} = useParams()
  const [showFollow,setShowFollow] = useState(true)
  var location = useLocation()
  useEffect(()=>{
    setShowFollow(state && !state.following.includes(userId))
  },[state])
  console.log(userId)
  useEffect(()=>{
    fetch(`/user/${userId}`,{
    headers:{
      "Authorization":"Bearer "+localStorage.getItem("jwt")}
    }).then(res=>res.json())
    .then(result=>{
      setProfile(result)
    })
  },[])
  const followUser = ()=>{
    fetch('/follow',{
      method : "put",
      headers :{
        "Content-Type":"application/json",
        "Authorization" : "Bearer "+localStorage.getItem("jwt")
    },
    body :JSON.stringify({
      followId : userId
    })
    }
    ).then(res=>res.json())
    .then(data=>{
      console.log(data)
      dispatch({type:"UPDATE",
    payload : {following : data.following,
    followers : data.followers}})
    localStorage.setItem("user",JSON.stringify(data))
    setProfile((prevState)=>{
      return {...prevState,
        user :{
          ...prevState.user,
          followers : [...prevState.user.followers,data._id]
        }
    }
    })
    setShowFollow(false)  
  })
  } 
  const unfollowUser = ()=>{
    fetch('/unfollow',{
      method : "put",
      headers :{
        "Content-Type":"application/json",
        "Authorization" : "Bearer "+localStorage.getItem("jwt")
    },
    body :JSON.stringify({
      unfollowId : userId
    })
    }
    ).then(res=>res.json())
    .then(data=>{
      console.log(data)
      dispatch({type:"UPDATE",
    payload : {following : data.following,
    followers : data.followers}})
    localStorage.setItem("user",JSON.stringify(data))
    setProfile((prevState)=>{
      const newFollowerList = prevState.user.followers.filter(item=>item!==data._id)
      return {...prevState,
        user :{
          ...prevState.user,
          followers : newFollowerList
        }
    }
    })
    setShowFollow(true)
  })
}

console.log("location->", location.pathname)
    return (
      <>
      
      {userProfile ? 
      <div style={{maxWidth:"550px", margin:"0px auto"}}>
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
            <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
            src={userProfile?userProfile.user.profilePic:"loading..."}>
            </img>
            </div>
          <div>
            <h4>
              {userProfile.user.name}
            </h4>
            <h5>
              {userProfile.user.email}
            </h5>
            <div style={{display:'flex',justifyContent:"space-between",width:"108%"}}>
              <h5>{userProfile.posts.length}posts</h5>
              <Link to={location.pathname+'/following'}>
                <h5>{userProfile.user.following.length}following</h5>
                </Link> 
                <Link to={location.pathname+'/follower'}>
              <h5>{userProfile.user.followers.length}followers</h5>
                </Link>
            </div>
            {showFollow?
                    <button style={{
                        margin:"10px"
                    }} className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={()=>followUser()}
                    >
                        Follow
                    </button>
                    : 
                    <button
                    style={{
                        margin:"10px"
                    }}
                    className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={()=>unfollowUser()}
                    >
                        UnFollow
                    </button>
                    }
            </div> 
          </div>
          <div className="gallery" style={{display:'flex'}}>
            {
              userProfile.posts.map(item=>{
                return(
                  <div>
                  <Link to = {"/"+state._id+'/post/'+item._id}>
                <img key={item._id} className ="item" src={item.photo} alt={item.title}></img>
                  </Link>
                </div>
                )
              })
            }
          </div>
    </div> 
    : <h2>loading...!</h2>}
    </>
  )
}
export default Profile