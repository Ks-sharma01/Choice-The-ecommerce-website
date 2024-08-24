import { useState, useEffect } from "react"
import Layout from "./Layout"
import firebaseAppConfig from "../utils/firebase.config";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { getFirestore, getDocs, collection, query, where, doc, deleteDoc, serverTimestamp, addDoc } from "firebase/firestore";
import axios from "axios";
import useRazorpay from "react-razorpay";
import { useNavigate } from "react-router-dom";


const auth = getAuth(firebaseAppConfig)
const db = getFirestore(firebaseAppConfig)

const Cart = () => {
    const navigate = useNavigate()
    const [Razorpay] = useRazorpay();
    const [session, setSession] = useState(null)
    const [products, setProducts] = useState([])
    const [updateUi, setUpdateUi] = useState(false)
    const [address, setAddress] = useState(null)

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setSession(user)
            }
            else {
                setSession(null)
            }
        })
    }, [])

    useEffect(() => {
        const req = async () => {

            if (session) {
                const col = collection(db, "carts")
                const q = query(col, where("userId", "==", session.uid))
                const snapshot = await getDocs(q)
                const temp = []
                snapshot.forEach((doc) => {
                    const document = doc.data()
                    document.cartId = doc.id
                    temp.push(document)
                })
                setProducts(temp)
            }
        }
        req()
    }, [session, updateUi])
    useEffect(() => {
        const req = async () => {
            if (session) {
                const col = collection(db, "addresses",)
                const q = query(col, where("userId", "==", session.uid))
                const snapshot = await getDocs(q)
                snapshot.forEach((doc) => {
                    const document = doc.data()
                    setAddress(document)

                })
            }
        }
        req()
    }, [session])

    const getPrice = (products) => {
        let sum = 0
        for (const items of products) {
            const amount = Math.round(items.price - (items.price * items.discount) / 100)
            sum = sum + amount
        }
        return sum
    }
    const removeCart = async (id) => {
        const ref = doc(db, "carts", id)
        await deleteDoc(ref)
        setUpdateUi(!updateUi)
    }

    const buyNow = async () => {
        try {

            const amount = getPrice(products)
            const { data } = await axios.post("http://localhost:8000/order", { amount: amount })

            const options = {

                key: "rzp_test_xM02CBfMvhikdX",
                amount: data.amount,
                order_id: data.orderId,
                name: "Choice",
                description: "Cart products",
                image: "/images/choice-logo.png",
                handler: async function (response) {
                    for (const item of products) {
                        let products = {
                            ...item,
                            userId: session.uid,
                            status: "pending",
                            email: session.email,
                            customerName: session.displayName,
                            createdAt: serverTimestamp(),
                            address: address
                        }

                        await addDoc(collection(db, "orders"), products)
                        await removeCart(item.cartId)
                    }

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

            <div className="md:my-10 md:w-7/12 bg-white mx-auto border shadow-lg p-10 rounded ">
                <div className="flex justify-center item-center ">
                    <i className="ri-shopping-cart-2-line text-3xl"></i>
                    <h1 className="text-2xl font-semibold">Cart</h1>
                </div>
                <hr className="my-2" />
                <div className="space-y-8 ">
                    {products.map((item, index) => (
                        <div key={index} className="flex gap-2">
                            <img src={item.image} className="w-[100px] border"></img>
                            <div>
                                <h1 className="font-semibold text-lg capitalize">{item.title}</h1>
                                <div className="space-x-1">
                                    <label className=" font-bold">₹{(item.price - (item.price * item.discount) / 100).toLocaleString()}</label>
                                    <del>₹{item.price.toLocaleString()}</del>
                                    <label className="text-gray-600">({item.discount}% Off)</label>
                                </div>
                                <button onClick={() => removeCart(item.cartId)} className="bg-rose-600 py-1 px-2 rounded text-white my-2">
                                    <i className="ri-delete-bin-line"></i>
                                    Remove
                                </button>
                            </div>


                        </div>
                    ))}
                </div>
                <hr className="my-4" />
                <div className="flex justify-between items-center">

                    <h1 className="font-semibold text-xl">Total Price: ₹{getPrice(products).toLocaleString()}</h1>
                    {
                        (products.length > 0) &&
                    <button onClick={() => buyNow()} className="bg-green-600 py-2 px-3 font-semibold rounded text-white hover:bg-blue-600 my-1">
                        <i className="ri-shopping-bag-4-line mr-1"></i>
                        Buy Now
                    </button>
                    }
                </div>
            </div>
        </Layout>
    )
}
export default Cart