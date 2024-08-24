import { useState } from "react"
import {Link, useNavigate} from 'react-router-dom'
import firebaseAppConfig from "../utils/firebase.config"
import { signInWithEmailAndPassword, getAuth } from "firebase/auth"
const auth = getAuth(firebaseAppConfig)

const Login = () =>{
          const navigate = useNavigate()
          const [showpassword, setShowpassword] = useState("password")
          const [error, setError] = useState(null)
          const [loader, setLoader] = useState(false)


          const [formvalue, setFormvalue] = useState({
                    email: "",
                    password: ""
          })
          const login = async(e)=>{
                    try{
                              e.preventDefault()
                              setLoader(true)
                              await signInWithEmailAndPassword(auth, formvalue.email, formvalue.password)
                              
                              navigate("/")

                    }
                    catch(err){
                              setError("Invalid Credentials Provided")
                    }
                    finally{
                              setLoader(false)
                    }
          }
          const handleinput = (e)=>{
                    const input = e.target
                    const name = input.name
                    const value = input.value
                    setFormvalue({
                              ...formvalue,
                              [name]: value
                    })
                    setError(null)
          }
          return(
                    <div className="grid md:grid-cols-2 animate__animated animate__fadeIn">

                              <img src="/images/signup.svg" alt="error"/>
                              <div className="flex flex-col p-6">
                                        <h1 className="text-4xl font-bold">Login</h1>
                                        <p className="text-lg text-gray-600">Enter profile details for login</p>
                                        <form action="" className="mt-4 space-y-2" onSubmit={login}>
                                                  <div className="flex flex-col ">
                                                            <label className="mb-2 font-semibold text-lg">Email</label>
                                                            <input type="email"
                                                            onChange={handleinput}
                                                            required 
                                                            name="email"
                                                            placeholder="Enter email"
                                                            className="p-2 border border-gray-300 rounded"

                                                            />
                                                  </div>
                                                  <div className="flex flex-col relative">
                                                            <label className="mb-2 font-semibold text-lg">Password</label>
                                                            <input type= {showpassword}
                                                            onChange={handleinput}
                                                            required 
                                                            name="password"
                                                            placeholder="Enter password"
                                                            className="p-2 border border-gray-300 rounded"

                                                            />
                                                  <button type="button" 
                                                  className="absolute top-10 right-2 w-8 h-8 rounded-full hover:bg-gray-300 hover:text-slate-600"
                                                  onClick={()=>setShowpassword((showpassword==="password") ? "text" : "password") }>
                                                  {
                                                            showpassword==="password" 
                                                            ? <i className="ri-eye-line"></i>
                                                            : <i class="ri-eye-off-line"></i>
                                                  }
                                                  </button>
                                                  </div>
                                                  {
                                                            loader ?
                                                  <h1 className="font-semibold text-gray-600 mt-4">Loading...</h1>
                                                  :
                                                  <button className="py-2 px-4 hover:bg-rose-600 bg-blue-600 font-semibold text-lg rounded text-white">Login
                                                  </button>
                                                  }
                                        </form>
                                        <div className="mt-2">
                                                  Don't have an account ? <Link to="/signup" className="text-blue-600 font-semibold">Register Now</Link>
                                        </div>
                                        {
                                                  error &&
                                        <div className="flex justify-between items-center bg-rose-500 font-semibold text-white mt-2 p-1 rounded shadow animate__animated animate__pulse">
                                                  <p>{error}</p>
                                                  <button onClick={()=>setError(null)}>
                                                  <i className="ri-close-line"></i>
                                                  </button>
                                        </div>
                                        }
                              </div>
                    </div>
                    
          )
}
export default Login