import React,{useEffect,createContext,useReducer,useContext} from "react";
import NavBar from "./components/Navbar";
import "./App.css" 
import {BrowserRouter,Route,Switch,useHistory} from "react-router-dom"
import Home from "./components/screen/Home"
import Signin from "./components/screen/Signin"
import Profile from "./components/screen/Profile"
import Signup from "./components/screen/Signup"
import CreatePost from "./components/screen/Createpost"
import {reducer,initialState} from "./reducers/userReducer"
import UserProfile from './components/screen/UserProfile'
import MyHome from './components/screen/GetSubscribedPost'
import Change from './components/screen/ChangeProfilePic'
import Reset from "./components/screen/ResetPassword";
import NewPassword from "./components/screen/NewPassword";
import UserFollowers from "./components/screen/UserFollowers"
import UserFollowing from "./components/screen/UserFollowing"
import Likes from "./components/screen/Likes";
import Post from "./components/screen/Post";
export const UserContext = createContext()
const Routing = ()=>{
  const history = useHistory()
  const {state,dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER",payload:user})
    }else{
      if(!history.location.pathname.startsWith('/reset')){
      history.push('/signin')}
    }
  },[])
  return (
    <Switch>
    <Route exact path="/explore">
      <Home></Home>
    </Route>
    <Route exact path="/">
      <MyHome></MyHome>
    </Route>
    <Route path="/signin">
      <Signin/>
    </Route>
    <Route path="/create">
      <CreatePost/>
    </Route>
    <Route path="/signup">
      <Signup/>
    </Route>
    <Route exact path="/profile">
      <Profile></Profile>
    </Route>
    <Route exact path="/profile/:userId">
      <UserProfile></UserProfile>
    </Route>
    <Route path="/change">
      <Change></Change>
    </Route>
    <Route exact path="/reset">
    <Reset/>
    </Route>
    <Route path="/reset/:token">
    <NewPassword/>
    </Route>
    <Route path="/profile/:id/followers/">
    <UserFollowers/>
    </Route>
    <Route path="/profile/:id/following/">
    <UserFollowing/>
    </Route>
    <Route exact path="/:userid/post/:postid/">
    <Post/>
    </Route>
    <Route exact path="/:userid/post/:id/likes/">
    <Likes/>
    </Route>
    </Switch>

  )
}

function App() {
  const [state,dispatch] = useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
      <NavBar/>
      <Routing />
  </BrowserRouter>
  </UserContext.Provider>
  );
}

export default App;
