import React,{useState,useEffect,useContext} from 'react';
import { Link } from 'react-router-dom';
import {UserContext} from '../../App'
const Home =()=> {
  const[data,setData] = useState([])
  const {state,dispatch} = useContext(UserContext)
  useEffect(()=>{
    fetch('/allSubpost',{
    headers:{
      "Authorization":"Bearer "+localStorage.getItem("jwt")
      }
    }).then(res=>res.json())
    .then(result=>{
      setData(result.posts)
    })
    },[])
    const likePost = (id)=>{
      fetch('/like',{
          method:"put",
          headers:{
              "Content-Type":"application/json",
              "Authorization":"Bearer "+localStorage.getItem("jwt")
          },
          body:JSON.stringify({
              postId:id
          })
      }).then(res=>res.json())
      .then(result=>{
               //   console.log(result)
        const newData = data.map(item=>{
            if(item._id===result._id){
                return result
            }else{
                return item
            }
        })
        setData(newData)
      }).catch(err=>{
          console.log(err)
      })
}
const unlikePost = (id)=>{
      fetch('/unlike',{
          method:"put",
          headers:{
              "Content-Type":"application/json",
              "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
              postId:id
            })
          }).then(res=>res.json())
          .then(result=>{
            //   console.log(result)
            const newData = data.map(item=>{
              if(item._id===result._id){
                return result
              }else{
                return item
              }
            })
            setData(newData)
          }).catch(err=>{
            console.log(err)
          })
        }
      const makeComment = (text,postId)=>{
          fetch('/comment',{
              method:"put",
              headers:{
                  "Content-Type":"application/json",
                  "Authorization":"Bearer "+localStorage.getItem("jwt")
              },
              body:JSON.stringify({
                postId,
                text
              })
            }).then(res=>res.json())
            .then((result)=>{
              console.log(result)
              const newData = data.map(item=>{
                if(item._id===result._id){
                  return result
                }else{
                  return item
                }
              })
              setData(newData)
            }).catch(err=>{
              console.log(err)
            })
          }
          const deletePost = (postId)=>{
            fetch(`/deletepost/${postId}`,{
              method:"delete",
              headers:{
                  "Content-Type":"application/json",
                  "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
            }).then(res=>res.json())
            .then(result=>{
              console.log(result)
              const newData = data.filter(item=>{
                return item._id !==result._id
              })
              setData(newData)
            })
          }
          const deletecomment = (postId,commentId)=>{
            const newPostId = postId.toString()
            const newcommentId = commentId.toString()
            fetch(`/deletecomment/${newPostId}/${newcommentId}`,{
              method : "delete",
              headers:{
                "Authorization" : "Bearer "+localStorage.getItem("jwt")
              }
            }).then(res=>res.json())
            .then(result=>{
              const newData = data.map((item) => {

                if (item._id === result._id) {
                        return result;
                } else {
                  return item;
                }
              });
              setData(newData);
            })
          }
        return (
          <div className="home">{
            data.map(item=>{
              return(
                <div className="card home-card like-post z-depth-1" key={item._id}>
            <h5 style={{paddingTop:"5px"}}><Link to={item.postedBy._id !== state._id?"/profile/"+item.postedBy._id : "/profile/"}>
              <div className="name"><img style={{width:"40px",height:"40px",borderRadius:"9999px"} }
            src={item.postedBy.profilePic?item.postedBy.profilePic:""} key={item._id}>
              </img> 
              <span style={{fontFamily:`TwitterChirp, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`, fontSize:"15px",fontWeight:"600",marginLeft:"5px",marginTop:"0",WebkitJustifyContent:"space-evenly"}}>
                 @{item.postedBy.name}                 
                 </span>
              </div>
                 </Link>
                 {item.postedBy._id === state._id &&
            <i className="material-icons" style={{
              float: 'right'
            }}
            onClick={()=>{deletePost(item._id)}}
          >delete</i>}
          </h5>
            <div className="card-image z-depth-1">
            <img src={item.photo} width="500" height="300" alt={item.title}></img>
            <div className="card-content">
              <i className="material-icons" color="red">favorite</i>
              {item.likes.includes(state._id)?
              <i className="material-icons like-post"
              onClick={()=>{unlikePost(item._id)}}
              >thumb_down</i> : 
              <i className="material-icons like-post"
              onClick={()=>{likePost(item._id)}}
              >thumb_up</i>
            }
            <Link to={'/'+item.postedBy._id+'/post/'+item._id+'/likes'}>
              <h6> {item.likes.length} likes</h6>
              </Link>
              <h6>{item.title}</h6>
              <p>{item.body}</p>
              {
                item.comments.map(record=>{
                  return (
                    <h6 key={record._id} ><span style={{fontWeight:"500"}}> <Link to={record.postedBy._id===state._id?"/profile/":"/profile/"+record.postedBy._id}>
                      
                      </Link>
                      {record.postedBy.name }
                      </span>  {record.text}
                  {((item.postedBy._id === state._id) || (record.postedBy._id===state._id))&&
                      <i className="material-icons" style={{
                        float: 'right'
                      }}
                      onClick={()=>{deletecomment(item._id,record._id)}}  >delete</i>
                  }
                    </h6>
                  )
                })
              }
              <form onSubmit={(e)=>{
                e.preventDefault()
              makeComment(e.target[0].value,item._id)
              }}>
              <input type="text" placeholder="add a comment" />
              </form>
            </div>
            </div>
          </div>
        )
      })
  }
    </div>
  )
}
export default Home