import Layout from "./Layout"
const Contact =()=>{
          return(
                    <Layout>

                    <div className="md:w-6/12 mx-auto md:my-8 shadow-lg border bg-white">
                              <img src="/images/contact.webp"/>
                              <div className="p-8">
                              <form action="" className=" space-y-2">
                                                  <div className="flex flex-col ">
                                                            <label className="mb-2 font-semibold text-lg">FullName</label>
                                                            <input type="text" 
                                                            required
                                                            name="fullname"
                                                            placeholder="Enter name"
                                                            className="p-1.5 border border-gray-300 rounded"

                                                            />
                                                  </div>
                                                  <div className="flex flex-col ">
                                                            <label className="mb-2 font-semibold text-lg">Email</label>
                                                            <input type="email"
                                                            required 
                                                            name="email"
                                                            placeholder="Enter email"
                                                            className="p-1.5 border border-gray-300 rounded"

                                                            />
                                                  </div>
                                                  <div className="flex flex-col ">
                                                            <label className="mb-2 font-semibold text-lg">Message</label>
                                                            <textarea 
                                                            required 
                                                            name="email"
                                                            rows={4}
                                                            placeholder="Enter message"
                                                            className="p-1.5 border border-gray-300 rounded"

                                                            />
                                                  </div>
                                                 
                                                  <button className="py-2 px-4 hover:bg-rose-600 bg-blue-600 font-semibold text-lg rounded text-white">Get Quote</button>
                                        </form>    

                              </div>
                              
                    </div>
                    </Layout>
          )
}
export default Contact