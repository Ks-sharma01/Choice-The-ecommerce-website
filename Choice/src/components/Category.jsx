import { useState } from "react"
import Layout from "./Layout"
const Category =()=>{
          const [category, setCategory] = useState([
                    {
                           title:  "Electronics"   
                    },
                    {
                           title:  "Clothes"   
                    },
                    {
                           title:  "Grocery"   
                    },
                    {
                           title:  "Toys"   
                    },
          ])
          return(
                    <Layout>

                    <div className="md:p-16 p-8">
                              <div className="w-10/12 mx-auto grid md:grid-cols-4 md:gap-16 gap-4">
                                        
                                        {
                                                  category.map((item, index)=>(

                                                  <div key={index} className="hover:bg-orange-600 hover:text-white border rounded-lg bg-white shadow-lg flex flex-col p-6 justify-center items-center">
                                                            <i className="ri-menu-search-line text-5xl"></i>
                                                            <h1 className="text-xl font-bold">{item.title}</h1>
                                                  </div> 
                                                  ))
                                        }
                                        
                              </div>
                    </div>
                    </Layout>
          )
}
export default Category