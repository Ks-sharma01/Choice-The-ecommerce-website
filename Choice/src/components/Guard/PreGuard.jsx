import { useEffect, useState } from "react"
import {  Outlet, Navigate } from "react-router-dom"
import firebaseAppConfig from "../../utils/firebase.config"
import { onAuthStateChanged, getAuth } from "firebase/auth"
const auth = getAuth(firebaseAppConfig)
const PreGuard = ()=>{
          const [session, setSession] = useState(null)
          const [loader, setLoader] = useState(false)

          useEffect(()=>{
                    onAuthStateChanged(auth, (user)=>{
                              if(user){
                                    setSession(user)
                              }
                              else{
                                       setSession(false)
                              }
                    })
          },[])
          if(session===null){
                    return(
                                        loader ?
                                        <h1 className="font-semibold text-gray-600 mt-4">Loading...</h1>
                                        :
                                        <button className="py-2 px-4 hover:bg-rose-600 bg-blue-600 font-semibold text-lg rounded text-white">Login
                                        </button>
                              )
                    }
          if(session){
                    return <Navigate to="/"/>
          }
          return <Outlet />
                    
          
}
export default PreGuard