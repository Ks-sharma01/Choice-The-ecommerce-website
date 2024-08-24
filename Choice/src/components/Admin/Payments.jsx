import { useState, useEffect } from "react"
import Layout from "./Layout"
import axios from "axios" 
import moment from "moment/moment"
const Payments =()=>{
          const [payments,setPayments] = useState([])
          useEffect(()=>{
                    const req = async ()=>{
                              try {
                                    const {data} = await axios.get("http://localhost:8000/payments")    
                                    setPayments(data.items)
                              } catch (error) {
                                        console.log(error);
                              }
                    }
                    req()
          },[])
          console.log(payments);
          
          return(
                    <Layout>
                              <div>
                                       <h1 className="text-xl font-bold">Payments</h1>
                                       <div className="mt-4">
                                        <table className="w-full">
                                                  <thead>
                                                            <tr className='bg-rose-600 text-white text-left' >
                                                                      <th>PaymentId</th>
                                                                      <th className="p-2">Name</th>
                                                                      <th>Email</th>
                                                                      <th>Product</th>
                                                                      <th>Mobile</th>
                                                                      <th>Amount</th>
                                                                      <th>Date</th>
                                                                      
                                                            </tr>
                                                  </thead>
                                                  <tbody>
                                                            {payments.map((items,index)=>(
                                                            <tr key={index}
                                                            style={{

                                                                      background: (index+1)%2 === 0 ? "#f1f5f9": "white"
                                                            }
                                                            }
                                                            >
                                                                      
                                                                      <td>{items.id}</td>
                                                                      <td className="capitalize p-1">
                                                                                <div className="flex gap-1 items-center">
                                                                                {/* <img src="/images/images.jpg" alt="error" className="w-7 h-7 rounded-full " /> */}
                                                                                <div className="flex flex-col">
                                                                                <span className="font-semibold">{items.notes.name}</span>
                                                                                <small className="text-gray-600">{items.date}</small>
                                                                                </div>
                                                                                </div>
                                                                      </td>
                                                                      <td>{items.email}</td>
                                                                      <td>{items.description}</td>
                                                                      <td>{items.contact}</td>
                                                                      
                                                                      <td>₹{items.amount.toLocaleString()}</td>
                                                                      <td>{moment.unix(items.created_at).format("DD MMM YYYY, hh:mm:ss A")}</td>
                                                                      
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
export default Payments