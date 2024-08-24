import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom";
import firebaseAppConfig from "../../utils/firebase.config";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const auth = getAuth(firebaseAppConfig)

const Layout = ({ children }) => {
          const [show, setShow] = useState(160);
          const [mobilesize, setMobileSize] = useState(0);

          const [accountClose, setAccountClose] = useState(false);
          const [session, setSession] = useState(null)
          const location = useLocation();

          useEffect(()=>{
            onAuthStateChanged(auth, (user)=>{
               if(user){
                  setSession(user)
               }
               else{
                  setSession(null)
               }
            })
          })
          const menu = [
                    {
                              label: "Dashboard",
                              link: "/admin/dashboard",
                              icon: <i className="ri-dashboard-line mr-2"></i>
                    },
                    {
                              label: "Customers",
                              link: "/admin/customers",
                              icon: <i class="ri-user-line mr-2"></i>
                    },
                    {
                              label: "Products",
                              link: "/admin/products",
                              icon: <i className="ri-shopping-cart-line mr-2"></i>
                    },
                    {
                              label: "Orders",
                              link: "/admin/orders",
                              icon: <i class="ri-shape-line mr-2"></i>
                    },
                    {
                              label: "Payments",
                              link: "/admin/payments",
                              icon:  <i className="ri-money-dollar-circle-line mr-2"></i>
                    },
                    {
                              label: "Settings",
                              link: "/admin/settings",
                              icon:  <i class="ri-settings-4-line mr-2"></i>
                    },
                    
          ]
          
          return (
                    <>
                       {/* desktop */}
                    <div className="md:block hidden">
                              <aside className="bg-indigo-500 fixed top-0 left-0 h-full overflow-hidden"
                                        style={{
                                                  width: show,
                                                  transition: '0.3s'
                                        }}

                              >
                                        <div className="flex flex-col w-full">
                                                  {menu.map((item, index) => (
                                                            <Link to={item.link} className=" p-2 text-gray-200 text-[17px] hover:bg-rose-600" key={index}
                                                                      style={{
                                                                                background: (location.pathname == item.link)? "#e11d48":"transparent"
                                                                      }} >
                                                                      {item.icon}
                                                                      {item.label}</Link>
                                                  ))}
                                                  <button 
                                                  onClick={()=>signOut(auth)}
                                                  className=" p-2 text-gray-200 text-left text-[17px] hover:bg-rose-600" >
                                                  <i className="ri-logout-circle-r-line mr-2"></i>
                                                  Logout
                                                  </button>

                                        </div>

                              </aside>
                              <section className="bg-gray-200 min-h-screen"
                                        style={{
                                                  marginLeft: show,
                                                  transition: '0.3s'
                                        }}
                              >
                                        <nav className="bg-white p-4 shadow flex items-center justify-between sticky top-0 left-0 ">
                                                  <div className="flex gap-2 items-center">
                                                            <button
                                                                      className=" hover:bg-indigo-500 hover:text-white w-8 h-8 rounded"
                                                                      onClick={() => {
                                                                                
                                                                                setShow(show === 0 ? 160 : 0)}
                                                                      }
                                                            >
                                                                      <i className="ri-menu-2-line text-xl"></i>
                                                            </button>
                                                            <h1 className="font-semibold">Choice</h1>
                                                  </div>
                                                  <div>
                                                            <button className="relative"
                                                                      onClick={() => setAccountClose(!accountClose)}
                                                            >
                                                               <img src="/images/images.jpg" alt="error" className="w-8 h-8 rounded-full"/>
                                                                      {/* <i className="ri-account-circle-line text-2xl"></i> */}
                                                            </button>
                                                            {
                                                                      accountClose &&
                                                                      <div className=" absolute top-18 right-0 bg-white h-[100px] w-[150px] p-1 shadow">


                                                                                <div className="flex flex-col items-center">
                                                                                          <h1 className="font-semibold">{(session && session.displayName)? session.displayName : "Admin"}</h1>
                                                                                          <p className="text-sm text-gray-500">{session && session.email}</p>
                                                                                          <hr className="my-2"></hr>
                                                                                          <div>

                                                                                                    <button className="px-2"
                                                                                                      onClick={()=>signOut(auth)}
                                                                                                    >
                                                                                                              <i className="ri-logout-circle-r-line "></i>
                                                                                                              Log Out
                                                                                                    </button>
                                                                                          </div>
                                                                                </div>
                                                                      </div>
                                                            }
                                                  </div>
                                        </nav>

                                        <div className="p-4">
                                                  {children}

                                        </div>



                              </section>
                    </div>
                    {/* mobile */}
                    <div className="md:hidden block">
                              <aside className="bg-indigo-500 z-50 fixed top-0 left-0 h-full overflow-hidden"
                              style={{
                                 width: mobilesize,
                                 transition: "0.3s"
                              }}
                              >
             
                                        <div className="flex flex-col w-full">
                                          <button className="text-left mx-4 mt-4"
                                          onClick={() =>setMobileSize(mobilesize === 0 ? 140 : 0)}>                                            
                                          <i className="ri-menu-fill text-white text-2xl"></i>
                                          
                                          </button>
                                                  {menu.map((item, index) => (
                                                            <Link to={item.link} className=" p-2 text-gray-200 text-[17px] hover:bg-rose-600" key={index}
                                                                      style={{
                                                                                background: (location.pathname == item.link)? "#e11d48":"transparent"
                                                                      }} >
                                                                      {item.icon}
                                                                      {item.label}</Link>
                                                  ))}
                                                  <button 
                                                  onClick={()=>signOut(auth)} 
                                                  className=" p-2 text-gray-200 text-left text-[17px] hover:bg-rose-600" >
                                                  <i className="ri-logout-circle-r-line mr-2"></i>
                                                  Logout
                                                  </button>

                                        </div>

                              </aside>
                              <section className="bg-gray-200 h-screen">
                                      
                              
                                        <nav className="bg-white p-4  shadow flex items-center justify-between sticky top-0 left-0">
                                                  <div className="flex gap-2 items-center">
                                                            <button
                                                                      className=" hover:bg-indigo-500 hover:text-white w-8 h-8 rounded"
                                                                      onClick={() =>setMobileSize(mobilesize === 0 ? 140 : 0)}
                                                                      
                                                            >
                                                                      <i className="ri-menu-2-line text-xl"></i>
                                                            </button>
                                                            <h1 className="font-semibold">Choice</h1>
                                                  </div>
                                                  <div>
                                                            <button className="relative"
                                                                      onClick={() => setAccountClose(!accountClose)}
                                                            >
                                                                      <i className="ri-account-circle-line text-2xl"></i>
                                                            </button>
                                                            {
                                                                      accountClose &&
                                                                      <div className=" absolute top-18 right-0 bg-white h-[100px] w-[150px] p-1 shadow">


                                                                                <div className="flex flex-col items-center">
                                                                                          <h1 className="font-semibold">Kiran Sharma</h1>
                                                                                          <p className="text-sm text-gray-500">example@gmail.com</p>
                                                                                          <hr className="my-2"></hr>
                                                                                          <div>

                                                                                                    <button className="px-2"
                                                                                                    onClick={()=>signOut(auth)}

                                                                                                    >
                                                                                                              <i className="ri-logout-circle-r-line "></i>
                                                                                                              Log Out
                                                                                                    </button>
                                                                                          </div>
                                                                                </div>
                                                                      </div>
                                                            }
                                                  </div>
                                        </nav>

                                        <div className="p-4">
                                                  {children}

                                        </div>



                              </section>
                    </div>

                    </>
          )
}
export default Layout