import React, { useEffect,useState,useContext } from 'react'
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../App';
import M from "materialize-css"
const UploadProfilePic = ()=>{
  const [image,setImage] = useState(undefined)
  const {state,dispatch} =  useContext(UserContext)
  const [url,setUrl] = useState("")
  const history = useHistory()
  useEffect(()=>{
    if(url){
      console.log(url)
    fetch("/uploadpic",{
      method:"put",
      headers:{
        "Content-Type":"application/json",
        "Authorization" : "Bearer "+localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        profilePic :url
      })
    }).then(res=>res.json())
    .then(data=>{
      if(data.error){
        M.toast({html : data.error,classes:"#c62828 red darken-3"})
      }else{
        M.toast({html: "Uploaded Pic",classes:"#43a047 green darken-1"})
        history.push('/profile')
      }
    }).catch(err=>{
      console.log(err)
    })
  }
  },[url])
  const PicDetails = ()=>{
    const data = new FormData()
    data.append("file",image)
    data.append("upload_preset","insta-clone")
    data.append("cloud_name","iushiusosios")
    fetch("https://api.cloudinary.com/v1_1/iushiusosios/image/upload",{
      method:"post",
      body:data
    }).then(res=>res.json())
    .then(data=>{
      setUrl(data.url)
      localStorage.setItem("user",JSON.stringify({...state,profilePic:data.url}))
      dispatch({type : "UPDATE_PIC",payload : data.url })
    }).catch(err=>{
      console.log(err)
    })
  }
  return (

    <div className = "card input-filed"
    style={{
      margin: "30px auto",
      maxWidth : "500px",
      padding: "20px",
      textAlign : "center"
    }}
    > <h4> Upload New Profile Pic</h4>
      <div className="file-field input-field">
            <div className="btn #64b5f6 blue darken-1">
                <span>Choose Pic</span>
                <input type="file" onChange={(e)=>setImage(e.target.files[0])} />
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
            </div>
            </div>
      <div className="file-path-wrapper">
      </div>
      <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={()=>PicDetails()}>Upload Profile Pic</button>
    </div>
  )
}
export default UploadProfilePic