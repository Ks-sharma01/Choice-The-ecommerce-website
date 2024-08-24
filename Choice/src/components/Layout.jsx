import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import firebaseAppConfig from "../utils/firebase.config";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import {getFirestore, query, collection, getDocs, where} from "firebase/firestore"

const auth = getAuth(firebaseAppConfig)
const db = getFirestore(firebaseAppConfig)

const Layout = ({ children, update }) => {
   const navigate = useNavigate();
   const [open, setOpen] = useState(false)
   const [accountmenu, setAccountmenu] = useState(false)
   const [session, setSession] = useState(null)
   const [cartCount, setCartCount] = useState(0)
   const [role, setRole] = useState(null)
   useEffect(() => {
      onAuthStateChanged(auth, (user) => {
         if (user) {
            setSession(user)
         }
         else {
            setSession(false)
         }
      })
   }, [])
   
   useEffect(()=>{
      if(session){
         const req=async()=>{
            const col = collection(db, "carts")
            const q = query(col, where("userId", "==", session.uid))
            const snapshot = await getDocs(q)
            setCartCount(snapshot.size);
            
         }
         req()
      }
   },[session ,update])

   useEffect(()=>{
      if(session){
         const req=async()=>{
            const col = collection(db, "customers")
            const q = query(col, where("userId", "==", session.uid))
            const snapshot = await getDocs(q)
            
            snapshot.forEach((doc)=>{
               const customer= doc.data()
               
               setRole(customer.role)
            })
            
         }
         req()
      }
   },[session])
  
   
   const menus = [
      {
         label: "Home",
         src: "/"
      },
      {
         label: "Products",
         src: "/products"
      },
      {
         label: "Category",
         src: "/category"
      },
      {
         label: "Contact",
         src: "/contact"
      },
   ]
   const mobileLink = (href) => {
      navigate(href)
      setOpen(false)
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
      <div>
         <nav className="sticky top-0 left-0 shadow-lg bg-slate-100 z-50">
            <div className="w-10/12 mx-auto flex justify-between">
               <img src="/images/choice-logo.png" alt="Error" className="w-16" />
               <button className="md:hidden" onClick={() => setOpen(!open)}>
                  <i className="ri-menu-line text-3xl"></i>
               </button>
               <ul className="md:flex gap-8 items-center hidden">
                  {
                     menus.map((item, index) => (
                        <li key={index}>
                           <Link to={item.src}
                              className="hover:bg-blue-600 p-2 text-center hover:text-white"
                           >{item.label}</Link>
                        </li>
                     ))}
                     {
                        (session && cartCount>0) &&
                        <Link to="/cart" className="relative">
                           <i className="ri-shopping-cart-2-line text-xl"></i>
                           <div className="absolute -top-2 -right-2 bg-rose-600 w-4 h-4 flex justify-center items-center rounded-full text-white text-[8px] font-bold">{cartCount}</div>
                        </Link>
                     }
                  {
                     !session &&
                     <>
                        <Link
                           to="/login"
                           className="hover:bg-blue-600 p-2 text-center hover:text-white"
                        >Login</Link>
                        <Link
                           to="/signup"
                           className=" bg-blue-600 hover:bg-rose-500 px-6 py-2 text-white text-md font-semibold rounded text-center"
                        >Signup</Link>
                     </>
                  }
                  

  
                  {
                     session &&
                     <button className="relative" onClick={()=>setAccountmenu(!accountmenu)}>
                        <img src={session.photoURL ? session.photoURL : "/images/images.jpg"} alt="error" className="w-7 h-7 rounded-full"/>
                        {
                           accountmenu && 
                        <div className=" flex flex-col items-start animate__animated animate__fadeIn w-[150px] py-2 fixed top-13 right-6 shadow-xl bg-white border border-gray-300">
                           { (role && role==="admin") &&
                            <Link to='/admin/dashboard' className="hover:bg-gray-200 text-left px-4 py-2 w-full">
                            <i className="ri-file-shield-2-line mr-2"></i>
                            Admin Panel
                            </Link>
                           }
                           <Link to='/profile' className="hover:bg-gray-200 text-left px-4 py-2 w-full">
                           <i className="ri-user-line mr-2"></i>
                           My profile
                           </Link>
                           
                           <Link to='/cart' className="hover:bg-gray-200 text-left px-4 py-2 w-full">
                           <i className="ri-shopping-cart-2-line mr-2"></i>
                           Cart
                           </Link>
                           <button className="hover:bg-gray-200 text-left px-4 py-2 w-full" onClick={()=>signOut(auth)}>
                           <i className="ri-logout-circle-line mr-2"></i>
                              Logout
                           </button>
                        </div>
                        }
                     </button>
                  }


               </ul>
            </div>
         </nav>
         <div>
            {children}
         </div>
         <footer className="bg-orange-600 py-8">
            <div className="w-10/12 mx-auto grid md:grid-cols-4 gap-8 md:gap-0">
               <div className="pr-4">
                  <h1 className="text-white font-semibold text-2xl mb-2">Brand Details</h1>
                  <p className="text-slate-100">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad officia possimus voluptate esse quam, at, autem molestias animi repudiandae ducimus illo perferendis! Perferendis!</p>
                  <img src="/images/choice-logo.png" alt="Error" className="w-16" />
               </div>
               <div>
                  <h1 className="text-white font-semibold text-2xl mb-2">Website Links</h1>
                  <ul className="space-y-2 text-slate-100">

                     {
                        menus.map((item, index) => (
                           <li key={index}>
                              <Link to={item.src}
                              >{item.label}</Link>
                           </li>
                        ))}
                     <li><Link to="/login">Login</Link></li>
                     <li><Link to="/signup">Signup</Link></li>
                  </ul>

               </div>
               <div>
                  <h1 className="text-white font-semibold text-2xl mb-2">Follow Us</h1>
                  <ul className="space-y-2 text-slate-100">
                     <li><Link to="/">Facebook</Link></li>
                     <li><Link to="/">Instagram</Link></li>
                     <li><Link to="/">Linkedin</Link></li>
                     <li><Link to="/">Twitter</Link></li>
                     <li><Link to="/">YouTube</Link></li>
                  </ul>

               </div>
               <div>
                  <h1 className="text-white font-semibold text-2xl mb-2">Contact us</h1>
                  <form className="space-y-4">

                     <input type="text"
                        required
                        name="fullname"
                        className="w-full p-1 rounded"
                        placeholder="Your name"
                     />
                     <input type="email"
                        required
                        name="email"
                        className="w-full p-1 rounded"
                        placeholder="Enter Email"
                     />
                     <textarea
                        required
                        name="message"
                        placeholder="Message"
                        className="w-full p-1 rounded"
                        rows={3}
                     />
                     <button className="text-white bg-black px-3 py-1 rounded">Submit</button>

                  </form>
               </div>

            </div>


         </footer>


         <aside className="md:hidden bg-slate-900 shadow-lg fixed top-0 left-0 h-full overflow-hidden z-50"
            style={{
               width: (open ? 150 : 0),
               transition: '0.3s'
            }}
         >
            <div className="flex flex-col p-2 gap-8">
           { session &&
                     <button className="relative" onClick={()=>setAccountmenu(!accountmenu)}>
                        <div className="flex items-center">
                        <img src={session.photoURL ? session.photoURL : "/images/images.jpg"} alt="error" className="w-7 h-7 rounded-full"/>
                        <div>

                        <p className="text-white  font-semibold capitalize text-left">{session.displayName}</p>
                        <p className="text-white text-sm">{session.email}</p>
                        </div>

                        </div>
                        {
                           accountmenu && 
                        <div className=" flex flex-col items-start animate__animated animate__fadeIn w-[150px] py-2 fixed top-13 right-6 shadow-xl bg-white border border-gray-300">
                           <Link to='/profile' className="hover:bg-gray-200 text-left px-4 py-2 w-full">
                           <i className="ri-user-line mr-2"></i>
                           My profile
                           </Link>
                           <Link to='/cart' className="hover:bg-gray-200 text-left px-4 py-2 w-full">
                           <i className="ri-shopping-cart-2-line mr-2"></i>
                           Cart
                           </Link>
                           <button className="hover:bg-gray-200 text-left px-4 py-2 w-full" onClick={()=>signOut(auth)}>
                           <i className="ri-logout-circle-line mr-2"></i>
                              Logout
                           </button>
                        </div>
                        }
                     </button>
                  }

               {
                  menus.map((item, index) => (
                     <button onClick={() => mobileLink(item.src)} key={index} className="text-white">
                        {item.label}
                     </button>
                  ))
               }
            </div>
         </aside>

      </div>
   )
}

export default Layout