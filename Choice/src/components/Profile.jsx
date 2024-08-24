import { useEffect, useState } from "react"
import firebaseAppConfig from "../utils/firebase.config"
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth"
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"
import {getFirestore, collection, addDoc, getDocs, query, where, updateDoc, doc } from "firebase/firestore"
import Layout from "./Layout"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

const auth = getAuth(firebaseAppConfig)
const db = getFirestore(firebaseAppConfig)
const storage = getStorage()
const Profile = () => {
          const navigate = useNavigate();
          const [orders, setOrders] = useState([])
          const [session, setSession] = useState(null)
          const [uploading, setUploading] = useState(false)

          const [formValue, setFormValue] = useState({
                    fullname: "",
                    email: ""
                  })
                  const [addressformvalue, setAddressformvalue] = useState({
                    address: "",
                    city: "",
                    state: "",
                    country: "",
                    mobile: "",
                    pincode: "",
                    userId: ""

          })  
          const [isaddress, setIsaddress] = useState(false)
          const [docid, setDocid] = useState(null)
          const [isUpdated, setIsUpdated] = useState(false)

          useEffect(() => {
                    onAuthStateChanged(auth, (user) => {
                              if (user) {
                                        setSession(user)
                              }
                              else {
                                        setSession(false)
                                        navigate("/login")
                              }
                    })
          }, [])
          useEffect(() => {
                    const req= async ()=>{

                              if (session) {
                                        setFormValue({
                                                  ...formValue,
                                                  fullname: session.displayName,
                                                  mobile: (session.phoneNumber ? session.phoneNumber : '')
                                        })
                                        setAddressformvalue({
                                                  ...addressformvalue,
                                                  userId: session.uid
                                        })
                                        // fetch address
                                      const col = collection(db, "addresses")
                                      const q = query(col, where("userId","==",session.uid))
                                      const snapshot = await getDocs(q)

                                      setIsaddress(!snapshot.empty)

                                      snapshot.forEach((doc)=>{
                                        setDocid(doc.id)
                                        const address = doc.data()
                                        setAddressformvalue({
                                                  ...addressformvalue,
                                                  ...address
                                        })
                                      })
                              }
                    }
                    req()
          }, [session,isUpdated])

          useEffect(()=>{
            const req = async ()=>{
              if(session){
                const col = collection(db, "orders")
                const q = query(col, where("userId", "==", session.uid))
                const snapshot = await getDocs(q)
                const temp =[]
                snapshot.forEach((doc)=>{
                  temp.push(doc.data());
                })
                setOrders(temp)
              }
            }
            req()
          }, [session])
          const setProfilePic = async (e) => {
                    const input = e.target
                    const file = input.files[0]
                    const filenameArray = file.name.split(".")
                    const extension = filenameArray[filenameArray.length - 1]
                    const filename = Date.now() + "." + extension
                    const path = `pictures/${filename}`
                    const bucket = ref(storage, path)
                    setUploading(true)
                    const snapshot = await uploadBytes(bucket, file)
                    const url = await getDownloadURL(snapshot.ref)
                    await updateProfile(auth.currentUser, {
                              photoURL: url
                    })
                    setSession({
                              ...session,
                              photoURL: url
                    })
                    setUploading(false)
          }

          const handleFormvalue = (e) => {
                    const input = e.target
                    const name = input.name
                    const value = input.value
                    setFormValue({
                              ...formValue,
                              [name]: value
                    })
          }
          const saveProfileinfo = async (e) => {
                    e.preventDefault()
                    await updateProfile(auth.currentUser, {
                              displayName: formValue.fullname,
                              phoneNumber: formValue.mobile
                    })
                    new Swal({
                              icon: "success",
                              title: "Profile Saved!!"
                    })
          }
          const handleaddressvalue =(e)=>{
                    const input = e.target
                    const name= input.name
                    const value = input.value
                    setAddressformvalue({
                              ...addressformvalue,
                              [name]: value
                    })
          }
          const saveAddress = async (e)=>{
                    try{

                              e.preventDefault()
                              const x = await addDoc(collection(db, "addresses"), addressformvalue)
                              setIsaddress(true)
                              setIsUpdated(!isUpdated)
                              new Swal({
                                        icon: "success",
                                        title: "Address Saved!!"
                              })
                    }
                    catch(err){
                              new Swal({
                                        icon: "error",
                                        title: "Failed!!",
                                        text: err.message
                              })
                    }
          }
          const updateAddress = async (e)=>{

                    try{
                              e.preventDefault()
                              const ref = doc(db, "addresses", docid)
                              await updateDoc(ref, addressformvalue)
                              
                              
                              new Swal({
                                        icon: "success",
                                        title: "Address Updated!!"
                              })
                    }
                    catch(err){
                              new Swal({
                                        icon: "error",
                                        title: "Failed!!",
                                        text: err.message
                              })
                    }
          }
          const getStatusColor=(Status)=>{
            if(Status==="pending") return "bg-orange-600"
            else if (Status==="processing") return "bg-indigo-600"
            else if (Status==="dispatched") return "bg-green-600"
            else if (Status==="returned") return "bg-red-600"
            

          }
          if (session === null)
                    return (
                              <div className="bg-gray-200 h-full fixed top-0 left-0 w-full flex justify-center items-center">
                                        <div role="status">
                                                  <svg aria-hidden="true" className="w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                  </svg>
                                                  <span className="sr-only"></span>
                                        </div>
                              </div>
                    )

          return (
                    <Layout>
                              <div className="mx-auto md:my-8 shadow-lg rounded p-6 md:w-8/12 border">
                                        <div className="flex items-center gap-1">
                                                  <i className="ri-shopping-cart-line text-3xl"></i>
                                                  <h1 className="text-2xl font-semibold">Orders</h1>
                                        </div>
                                        <hr className="my-4" />
                                        {
                                          orders.map((item, index)=>(
                                            <div key={index} className="flex gap-2 mt-6">
                                              <img src={item.image ? item.image : "/images/images.jpg"} alt="Image" className="w-[100px]" />
                                              <div>
                                                <h1 className="capitalize font-semibold text-lg">{item.title}</h1>
                                                <p className="text-gray-600">{item.description.slice(0,50)}</p>
                                                <div>
                                                  <label className="text-lg font-semibold">Price: ₹{item.price - (item.price * item.discount) / 100}</label>
                                                  </div>
                                                  <button className={`mt-2 ${getStatusColor(item.status)} px-2 py-1 rounded text-white text-sm font-medium capitalize`}>{item.status ? item.status : "Pending"}</button>
                                                </div>
                                            </div>
                                          ))
                                        }
                              </div>
                              <div className="mx-auto md:my-8 shadow-lg rounded p-6 md:w-8/12 border">
                                        <div className="flex items-center gap-1">
                                                  <i className="ri-user-3-line text-3xl"></i>
                                                  <h1 className="text-2xl font-semibold">Profile</h1>
                                        </div>
                                        <hr className="my-4" />
                                        <div className=" w-fit mx-auto mb-4 relative">
                                                  {
                                                            uploading ?
                                                                      <img src="/images/loader.gif" className="w-20 h-20" />
                                                                      :
                                                                      <img src={session.photoURL ? session.photoURL : "/images/images.jpg"} alt="image" className="rounded-full w-20 h-20 border" />
                                                  }
                                                  <input type="file" accept="image/*" onChange={setProfilePic} className=" opacity-0 absolute top-0 left-0 w-full h-full" />

                                        </div>
                                        <form action="#" className="grid grid-cols-2 gap-6">
                                                  <div className="flex flex-col gap-2">
                                                            <label className="text-xl font-semibold">FullName</label>
                                                            <input type="text" onChange={handleFormvalue}
                                                                      required
                                                                      className="p-2 border rounded border-gray-300"
                                                                      value={formValue.fullname}
                                                                      name="fullname"
                                                            />
                                                  </div>
                                                  <div className="flex flex-col gap-2">
                                                            <label className="text-xl font-semibold">Email</label>
                                                            <input type="email" onChange={handleFormvalue}
                                                                      disabled
                                                                      required
                                                                      className="p-2 border rounded border-gray-300"
                                                                      value={session.email}
                                                                      name="email"
                                                            />
                                                  </div>
                                                  <div />
                                                  <button onClick={saveProfileinfo} className="w-fit col-span-2 px-3 py-2 text-white text-xl rounded bg-green-600 hover:bg-green-500">
                                                            <i className="ri-save-line mr-1"></i>
                                                            Save
                                                  </button>
                                        </form>
                              </div>

                              <div className="mx-auto md:my-8 shadow-lg rounded p-6 md:w-8/12 border">
                                        <div className="flex items-center gap-1">
                                                  <i className="ri-link-m text-3xl"></i>
                                                  <h1 className="text-2xl font-semibold">Delivery Address</h1>
                                        </div>
                                        <hr className="my-4" />

                                        <form action="#" className="grid grid-cols-2 gap-6" onSubmit={ isaddress? updateAddress: saveAddress}>

                                                  <div />
                                                  <div className="flex flex-col gap-2 col-span-2">
                                                            <label className="text-xl font-semibold">Address</label>
                                                            <textarea type="text" onChange={handleaddressvalue}
                                                                      required
                                                                      rows={3}
                                                                      className="p-2 border rounded border-gray-300"
                                                                      value={addressformvalue.address}
                                                                      name="address"
                                                            />
                                                  </div>
                                                  <div className="flex flex-col gap-2">
                                                            <label className="text-xl font-semibold">City</label>
                                                            <input type="text" onChange={handleaddressvalue}
                                                                      required
                                                                      className="p-2 border rounded border-gray-300"
                                                                      value={addressformvalue.city}

                                                                      name="city"
                                                            />
                                                  </div>
                                                  <div className="flex flex-col gap-2">
                                                            <label className="text-xl font-semibold">Mobile</label>
                                                            <input type="number" onChange={handleaddressvalue}
                                                                      required
                                                                      className="p-2 border rounded border-gray-300"
                                                                      value={addressformvalue.mobile}
                                                                      name="mobile"
                                                            />
                                                  </div>
                                                  <div className="flex flex-col gap-2">
                                                            <label className="text-xl font-semibold">State</label>
                                                            <input type="text" onChange={handleaddressvalue}
                                                                      required
                                                                      className="p-2 border rounded border-gray-300"
                                                                      value={addressformvalue.state}

                                                                      name="state"
                                                            />
                                                  </div>
                                                  <div className="flex flex-col gap-2">
                                                            <label className="text-xl font-semibold">Country</label>
                                                            <input type="text" onChange={handleaddressvalue}
                                                                      required
                                                                      className="p-2 border rounded border-gray-300"
                                                                      value={addressformvalue.country}

                                                                      name="country"
                                                            />
                                                  </div>
                                                  <div className="flex flex-col gap-2" id="address">
                                                            <label className="text-xl font-semibold">Pincode</label>
                                                            <input type="number" onChange={handleaddressvalue}
                                                                      required
                                                                      className="p-2 border rounded border-gray-300"
                                                                      value={addressformvalue.pincode}

                                                                      name="pincode"
                                                            />
                                                  </div>
                                        {
                                          isaddress ? 
                                                  <button className="w-fit col-span-2 px-3 py-2 text-white text-xl rounded bg-green-600 hover:bg-green-500">
                                                            <i className="ri-save-line mr-1"></i>
                                                            Update
                                                  </button>
                                          :
                                                  <button className="w-fit  col-span-2 px-3 py-2 text-white text-xl rounded bg-green-600 hover:bg-green-500">
                                                            <i className="ri-save-line mr-1"></i>
                                                            Save
                                                  </button>
                                        }
                                                  



                                        </form>
                              </div>
                    </Layout>
          )
}
export default Profile