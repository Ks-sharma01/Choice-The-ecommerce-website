import { useState, useEffect} from "react"
import Layout from "./Layout" 
import firebaseAppConfig from "../../utils/firebase.config"
import { getFirestore, collection, getDocs } from "firebase/firestore"
import moment from "moment/moment"
const db = getFirestore(firebaseAppConfig)
const Customers =()=>{
          const [customers,setCustomers] = useState([])
          useEffect(()=>{
                    const req=async ()=>{
                    const snapshot = await getDocs(collection(db, "customers"))
                    const temp =[]
                    snapshot.forEach((doc)=>{
                              const document = doc.data()
                              temp.push(document)

                    })
                    setCustomers(temp)
                    }
                    req()
          },[])
          return(
                    <Layout>
                              <div>
                                       <h1 className="text-xl font-bold">Customers</h1>
                                       <div className="mt-4">
                                        <table className="w-full">
                                                  <thead>
                                                            <tr className='bg-rose-600 text-white text-left' >
                                                            
                                                                      <th className="p-2">Customer's Name</th>
                                                                      <th>Email</th>
                                                                      <th>Mobile</th>
                                                                      <th>Date</th>
                                                                      
                                                                      
                                                            </tr>
                                                  </thead>
                                                  <tbody>
                                                            {customers.map((items,index)=>(
                                                            <tr key={index}
                                                            style={{

                                                                      background: (index+1)%2 === 0 ? "#f1f5f9": "white"
                                                            }
                                                            }
                                                            >
                                                                      
                                                                      <td className="capitalize p-1">
                                                                                <div className="flex gap-1 items-center">
                                                                                <img src="/images/images.jpg" alt="error" className="w-7 h-7 rounded-full " />
                                                                                <div className="flex flex-col">
                                                                                <span className="font-semibold">{items.customerName}</span>
                                                                                <small className="text-gray-600">{items.date}</small>
                                                                                </div>
                                                                                </div>
                                                                                </td>
                                                                      <td className="text-gray-600">{items.email}</td>
                                                                      <td className="text-gray-600">{items.mobile}</td>
                                                                      
                                                            
                                                                      <td className="text-gray-600">{moment(items.createdAt).format("DD MMM YYYY, hh:mm:ss A")}</td>
                                                                      
                                                                      
                                                            </tr>    
                                                            )
                                                                     
                                                            )}
                                                            
                                                  </tbody>
                                        </table>

                                       </div>
                              </div>
                    </Layout>
          )
}
export default Customers