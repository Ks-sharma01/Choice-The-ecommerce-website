import { useState, useEffect } from "react"
import Layout from "./Layout" 
import firebaseAppConfig from "../../utils/firebase.config"
import { getFirestore, getDocs, collection, updateDoc,doc, query } from "firebase/firestore"
import moment from "moment"

const db = getFirestore(firebaseAppConfig)

const Orders =()=>{
          
          const [orders, setOrders] = useState([])
          
          
          useEffect(()=>{
                    const req= async ()=>{
                              const snapshot = await getDocs(collection(db, "orders"))
                              const temp = []
                              snapshot.forEach((doc)=>{
                                        const order = doc.data()
                                        order.orderId = doc.id
                                        
                                        temp.push(order)
                              })
                              setOrders(temp)
                    }
                    req()
          }, [])
          
          const userOrderUpdateStatus= async (e, id)=>{
                    const status =  e.target.value
                    const ref = doc(db, "orders", id)
                    await updateDoc(ref, {status: status})
          }
          // useEffect(()=>{
          //           const req=async()=>{
          //           const snapshot = await getDocs(collection(db, "addresses"))
          //           const temp = []
          //           snapshot.forEach((doc)=>{
          //                     const document = doc.data()
                    
          //                     temp.push(document)
          //           })
          //           setOrders(temp)
          //           // 
          
          //           }
          //           req()
          // },[])
          
          return(
                    <Layout>
                              <div>
                                       <h1 className="text-xl font-bold">Orders</h1>
                                       <div className="mt-4 overflow-auto">
                                        <table className="w-[1600px]">
                                                  <thead>
                                                            <tr className='bg-rose-600 text-white' >
                                                                      <th className="py-2">OrderId</th>
                                                                      <th>Customer's Name</th>
                                                                      <th>Email</th>
                                                                      <th>Mobile</th>
                                                                      <th>Product</th>
                                                                      <th>Price</th>
                                                                      <th>Date</th>
                                                                      <th>Address</th>
                                                                      <th>Status</th>
                                                            </tr>
                                                  </thead>
                                                  <tbody>
                                                            {orders.map((items,index)=>(
                                                            
                                                            <tr className="text-center" key={index}
                                                            style={{

                                                                      background: (index+1)%2 === 0 ? "#e2e8f0": "white"
                                                            }
                                                            }
                                                            >
                                                                      <td className="py-2">{items.orderId}</td>
                                                                      <td className="capitalize">{items.customerName}</td>
                                                                      <td>{items.email}</td>
                                                                      <td>{items.address ? items.address.mobile : "not found"}</td>
                                                                      <td className="capitalize">{items.title}</td>
                                                                      <td> ₹{items.price.toLocaleString()}</td>
                                                                      <td>{moment(items.createdAt.toDate()).format("DD MMM YYYY, hh:mm:ss A")}</td>
                                                                      <td>{`${items.address.address}, ${items.address.state}, ${items.address.city}, ${items.address.country}, ${items.address.pincode}, mob: ${items.address.mobile}`}</td>
                                                                      <td className="capitalize">
                                                                                <select className="outline-none p-[3px] border border-gray-300" onChange={(e)=>userOrderUpdateStatus(e, items.orderId)}>
                                                                                          <option value="pending">Pending </option>
                                                                                          <option value="processing">Processing </option>
                                                                                          <option value="dispatched">Dispatched </option>
                                                                                          <option value="returned">Returned </option>
                                                                                </select>
                                                                                </td>
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
export default Orders