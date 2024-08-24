import { useState, useEffect } from "react";
import Layout from "./Layout"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import firebaseAppConfig from "../utils/firebase.config";
import { getFirestore, addDoc, collection,getDocs,serverTimestamp, query, where } from "firebase/firestore";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Swal from "sweetalert2";
import axios from "axios";
import useRazorpay from "react-razorpay";
import { useNavigate } from "react-router-dom";

const db =getFirestore(firebaseAppConfig)
const auth = getAuth(firebaseAppConfig)

const Home = ({slider, title="All Products"}) => {
    const navigate = useNavigate()
    const [Razorpay] = useRazorpay();
    const [session, setSession] = useState(null)
    const [products, setProducts] = useState([])
    const [address, setAddress] = useState(null)
    const [updateUi, setUpdateUi] = useState(false)
    useEffect(()=>{
        onAuthStateChanged(auth, (user)=>{
            if(user){
                setSession(user)
            }
            else{
                setSession(null)
            }
        })
    },[])
        useEffect(()=>{
            const req= async ()=>{
                const snapshot = await getDocs(collection(db, "products"))
                const temp =[]
                snapshot.forEach((doc)=>{
                    const allproducts = doc.data()
                    allproducts.id = doc.id
                    temp.push(allproducts);
                })
                setProducts(temp)

            }
            req()
        })
        useEffect(()=>{
            const req= async ()=>{
                if(session){
                    const col = collection(db, "addresses",)
                    const q = query(col, where("userId","==",session.uid))
                    const snapshot = await getDocs(q)
                    snapshot.forEach((doc)=>{
                        const document = doc.data()
                        setAddress(document)
                        
                    })
                }
            }
            req()
        },[session])
    
    const addToCart = async (item)=>{
        try {
            item.userId = session.uid
            await addDoc(collection(db, "carts"), item)
            setUpdateUi(!updateUi)
          
        } catch (error) {
            new Swal({
                icon: "error",
                title: "Failed!!",
                text: error.message
            })
        }
    }

    const buyNow= async (product)=>{
        try {
            const col = collection(db, "addresses")
            const q = query(col, where("userId", "==", session.uid))
            const snapshot = await getDocs(q)
            if(snapshot.empty){
                new Swal({
                    icon: "info",
                    title: "Update Address First",

                }).then((result)=>{
                    if(result.isConfirmed){
                        navigate("/profile#address")
                    }
                })
                return false
            }
            product.userId = session.uid
            product.status = "Pending"
            const amount = product.price - (product.price * product.discount) / 100
            const {data} =  await axios.post("http://localhost:8000/order", {amount: amount})
            
            const options = {

                key: "rzp_test_xM02CBfMvhikdX",
                amount: data.amount,
                order_id: data.orderId,
                name: "Choice",
                description: product.title,
                image: "/images/choice-logo.png",
                handler: async function(response){
                    product.email= session.email,
                    product.customerName= session.displayName
                    product.createdAt = serverTimestamp()
                    product.address = address
                   await addDoc(collection(db,"orders"), product)
                    navigate("/profile")
                },
                notes: {
                    name: session.displayName

                }
            }
            const rzp = new Razorpay(options)
            rzp.open()
           
        } catch (error) {
            console.log(error);
            
        }
    }
    return (
        <Layout update={updateUi}>
            <div>
                {
                    slider &&
                <header>
                    
                        
                    <Swiper
                    className="h-[250px] z-[-1]"
                        navigation={true}
                        modules={[Navigation, Pagination]}
                        pagination={true}
                        slidesPerView={1}>
                        <SwiperSlide>
                            <img src="/images/aa (1).jpg"/>
                        </SwiperSlide>
                        <SwiperSlide>
                            <img src="/images/aa (2).jpg" />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img src="/images/aa (3).jpg" />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img src="/images/aa (4).jpg" />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img src="/images/aa (5).jpg" />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img src="/images/aa (6).jpg" />
                        </SwiperSlide>
                    </Swiper>
                    
                </header>
                }
            </div>
            <div className="md:p-6 p-4">
                    <h1 className="text-3xl font-bold text-center">{title}</h1>
                    <p className=" text-center mx-auto mt-2 mb-8 text-gray-600 md:w-7/12">Lorem ipsum dolor sit amet consectetur elit. Ex adipisci inventore ab aperiam debitis quae exercitationem molestiae, aliquid, deleniti, nobis voluptatum esse est fuga dicta! Voluptas, earum! Iusto!</p>
                <div className="md:w-11/12 mx-auto gap-8 grid md:grid-cols-4">
                
                    {
                        products.map((item, index) => (
                            <div key={index} className="bg-white shadow">
                                <img src={item.image ? item.image : "/images/images.jpg"} alt="error" />
                                <div className="p-2 ">
                                    <h1 className="text-lg font-semibold capitalize ">{item.title}</h1>
                                </div>
                                <div className="space-x-1 pl-2">
                                    <label className=" font-bold">₹{item.price - (item.price * item.discount) / 100}</label>
                                    <del>₹{item.price}</del>
                                    <label className="text-gray-600">({item.discount}% Off)</label>
                                </div>
                                <button className="bg-green-500 py-2 w-full text-semibold text-white hover:bg-green-400 rounded mt-2" onClick={()=>buyNow(item)}>Buy Now</button>
                                <button onClick={()=>addToCart(item)} className="bg-rose-500 py-2 w-full text-semibold text-white hover:bg-rose-400 rounded mt-2">
                                    <i className="ri-shopping-cart-line mr-1"></i>
                                    Add To Cart</button>
                            </div>

))
}
</div>

            </div>
        </Layout>

    )
}
export default Home