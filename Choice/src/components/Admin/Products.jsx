import { useState, useEffect } from "react"
import Layout from "./Layout"
import firebaseAppConfig from "../../utils/firebase.config"
import { getFirestore, addDoc, collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore"
import Swal from "sweetalert2"
import uploadFile from "../../utils/storage"

const db = getFirestore(firebaseAppConfig)
const Products = () => {

  const [updateUi, setUpdateUi] = useState(false)
  const [products, setproducts] = useState([])
  const models = {
    title: "",
    price: "",
    discount: "",
    description: ""
  }
  const [productForm, setProductForm] = useState(models)
  const [model, setModel] = useState(false)
  const [applyCloseModel, setApplyCloseModel] = useState(false)
  const [edit, setEdit] = useState(null)

  useEffect(() => {
    const req = async () => {
      const snapshot = await getDocs(collection(db, "products"))
      const temp = []
      snapshot.forEach((doc) => {
        const allproducts = doc.data()
        allproducts.id = doc.id
        temp.push(allproducts)
      })
      setproducts(temp);
    }
    req()
  }, [updateUi])

  const handleModelClose = () => {
    setApplyCloseModel(true)
    setTimeout(() => {
      setModel(false)
    }, 700)
  }
  const handleModelOpen = () => {
    setApplyCloseModel(false)
    setModel(true)

  }
  const getFormValue = (e) => {
    const input = e.target
    const name = input.name
    const value = input.value
    setProductForm({
      ...productForm,
      [name]: value
    })
  }
  const submitFormValue = async (e) => {
    try {
      e.preventDefault()
      await addDoc(collection(db, "products"), productForm)
      console.log(productForm);
      setProductForm(models)
      handleModelClose()
      setUpdateUi(!updateUi)
    
    }
    catch (err) {
      new Swal({
        icon: "error",
        title: "Failed!!",
        text: err.message
      })
    }

  }
  const uploadimagefile = async (e, id) => {
    const input = e.target
    const file = input.files[0]
    const filenameArray = file.name.split(".")
    const extension = filenameArray[filenameArray.length - 1]
    const filename = Date.now() + "." + extension
    const path = `products/${filename}`
    const url = await uploadFile(file, path)
    const ref = doc(db, "products", id)
    await updateDoc(ref, { image: url })
    setUpdateUi(!updateUi)

  }

  const deleteProduct = async (id)=>{
    try {
      const ref = doc(db, "products", id)
      await deleteDoc(ref)
      setUpdateUi(!updateUi)
    } catch (error) {
      new Swal({
        icon: "error",
        title: "Failed to Delete"
      })
    }
  }

  const editProduct =(itemDetails)=>{
    setEdit(itemDetails)
    setProductForm(itemDetails)
    setModel(true)
  }

  const saveData= async (e)=>{
    try {
      e.preventDefault()
      const ref = doc(db, "products", edit.id)
      await updateDoc(ref, productForm)
      setProductForm(model)
      setModel(false)
      setEdit(null)
      setUpdateUi(!updateUi)
    } catch (error) {
      new Swal({
        icon: "success",
        title: "Updated!!"
      })
    }
    
  }
  return (
    <Layout>

      <div>
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold mb-4">Products</h1>
          <button className="bg-indigo-600 text-white rounded px-4 py-2" onClick={handleModelOpen}>
            <i className="ri-add-circle-line mr-1"></i>
            New Product
          </button>
        </div>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          {products.map((item, index) => (
            <div key={index} className="bg-white rounded-md shadow-lg">
              <div className="relative">
                <img src={item.image ? item.image : "/images/images.jpg"} className="rounded-t-md w-full h-[180px] object-cover" />
                <input type="file" accept="image/*" className="w-full h-full absolute top-0 left-0 opacity-0"
                  onChange={(e) => uploadimagefile(e, item.id)}
                />

              </div>
              <div className="p-2">
                <div className="flex items-center justify-between">

                  <h1 className="font-semibold text-lg capitalize">{item.title}</h1>
                  <div>
                    <button onClick={()=>editProduct(item)}>
                      <i className="ri-edit-box-line text-green-600"></i>

                    </button>

                  </div>
                  <div>
                    <button onClick={()=>deleteProduct(item.id)}>

                      <i className="ri-delete-bin-line text-red-600"></i>
                    </button>

                  </div>
                </div>
                <p className="text-gray-600">{item.description.slice(0, 50)}...</p>
                <div className="flex gap-1 mt-1">
                  <label>₹{item.price - (item.price * item.discount) / 100}</label>
                  <del className="font-semibold">₹{item.price}</del>
                  <label className="text-gray-600">({item.discount}% Off)</label>
                </div>
              </div>
            </div>
          ))}
        </div>
        {
          model &&
          <div className={`animate__animated ${applyCloseModel ? "animate__fadeOut" : "animate__fadeIn"} animate__faster bg-black bg-opacity-80 absolute top-0 left-0 w-full h-full flex justify-center items-center`}>
            <div className={`animate__animated ${applyCloseModel ? "animate__zoomOut" : "animate__zoomIn"} animate__faster bg-white w-6/12 rounded-md p-4 border border-1 relative`}>
              <button className="absolute top-1 right-2" onClick={handleModelClose}>
                <i className="ri-close-line text-lg"></i>
              </button>
              <h1 className="text-lg font-semibold">New Product</h1>
              <form className="grid grid-cols-2 gap-2 mt-2">
                <input type="text"
                  name="title"
                  onChange={getFormValue}
                  placeholder="Enter product title here"
                  className="p-2 border border-gray-300 col-span-2 outline-none"
                  value={productForm.title}

                />
                <input type="number"
                  required
                  onChange={getFormValue}
                  name="price"
                  placeholder="Price"
                  className="p-2 border border-gray-300 outline-none"
                  value={productForm.price}
                />
                <input type="number"
                  required
                  onChange={getFormValue}
                  name="discount"
                  placeholder="Discount"
                  className="p-2 border border-gray-300 outline-none"
                  value={productForm.discount}

                />
                <textarea rows={8}
                  required
                  onChange={getFormValue}
                  name="description"
                  placeholder="Description"
                  className="p-2 border border-gray-300 outline-none col-span-2"
                  value={productForm.description}

                />
                <div>

                  <button type="submit" onClick={edit ? saveData : submitFormValue } className="bg-indigo-600 text-white px-3 py-2 rounded mt-2">Submit</button>
                </div>

              </form>
            </div>
          </div>
        }
      </div>
    </Layout>

  )
}
export default Products