import { useState } from "react"
import { Link, useNavigate} from "react-router-dom"
import firebaseAppConfig from "../utils/firebase.config"
import {getAuth, createUserWithEmailAndPassword, updateProfile} from "firebase/auth"
import { getFirestore, addDoc,collection, serverTimestamp } from "firebase/firestore"

const db = getFirestore(firebaseAppConfig)
const auth = getAuth(firebaseAppConfig)

const Signup = () =>{
          const navigate = useNavigate()
          const [showpassword, setShowpassword] = useState("password")
          const [error, setError] = useState(null)
          const [loader, setLoader] = useState(false)
          const [formValue, setFormValue]= useState({
                    fullname: "",
                    email: "",
                    mobile:"",
                    password: ""
          })
          const signup = async(e)=>{
                    try {
                              e.preventDefault()
                              setLoader(true)
                              const userCredential = await createUserWithEmailAndPassword(auth, formValue.email, formValue.password)
                              await updateProfile(auth.currentUser,{
                                        displayName: formValue.fullname
                              })
                              await addDoc(collection(db, "customers"), {
                                        email: formValue.email,
                                        customerName: formValue.fullname,
                                        userId: userCredential.user.uid,
                                        mobile: formValue.mobile,
                                        role: "user",
                                        createdAt: serverTimestamp()
                              })      
                              navigate("/")
                    } catch (err) {
                              setError(err.message)
                    }
                    finally{
                              setLoader(false)
                    }
          }
          const handleChange =(e)=>{
                    const input=e.target;
                    const value = input.value;
                    const name =  input.name;
                    setFormValue({
                              ...formValue,
                              [name]:value
                    })
                    setError(null)

          }
          
          return(
                    <div className="grid md:grid-cols-2 animate__animated animate__fadeIn">

                              <img src="/images/signup.svg" alt="error"/>
                              <div className="flex flex-col p-2">
                                        
                                        <h1 className="text-3xl font-bold">New User</h1>
                                        <p className="text-lg text-gray-600">Create your account to start shopping</p>
                                        <form action="" className="mt-2 space-y-1" onSubmit={signup}>
                                                  <div className="flex flex-col ">
                                                            <label className="mb-1 font-semibold text-lg">FullName</label>
                                                            <input type="text" 
                                                            onChange={handleChange}
                                                            required
                                                            name="fullname"
                                                            placeholder="Enter name"
                                                            className="p-1.5 border border-gray-300 rounded"

                                                            />
                                                  </div>
                                                  <div className="flex flex-col ">
                                                            <label className="mb-2 font-semibold text-lg">Email</label>
                                                            <input type="email" onChange={handleChange}

                                                            required 
                                                            name="email"
                                                            placeholder="Enter email"
                                                            className="p-1.5 border border-gray-300 rounded"

                                                            />
                                                  </div>
                                                  <div className="flex flex-col ">
                                                            <label className="mb-2 font-semibold text-lg">Mobile</label>
                                                            <input type="number" onChange={handleChange}

                                                            required 
                                                            name="mobile"
                                                            placeholder="Enter mobile no"
                                                            className="p-1.5 border border-gray-300 rounded"

                                                            />
                                                  </div>
                                                  <div className="flex flex-col relative">
                                                            <label className="mb-2 font-semibold text-lg">Password</label>
                                                            <input type= {showpassword}
                                                            onChange={handleChange}

                                                            required 
                                                            name="password"
                                                            placeholder="Enter password"
                                                            className="p-1.5 border border-gray-300 rounded"

                                                            />
                                                  <button type="button" 
                                                  className="absolute top-10 right-4 w-8 h-8 rounded-full hover:bg-gray-300 hover:text-slate-600 "
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
                                                  <button className="py-2 px-4 hover:bg-rose-600 bg-blue-600 font-semibold text-lg rounded text-white">Signup
                                                  </button>
                                                  }
                                                  
                                        </form>
                                        <div className="mt-2">
                                                  Already have an account ? <Link to="/login" className="text-blue-600 font-semibold">Login</Link>
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
export default Signup