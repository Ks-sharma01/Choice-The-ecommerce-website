import {getStorage, ref ,uploadBytes, getDownloadURL} from "firebase/storage"

const storage =getStorage()
const uploadFile = async (file, path)=>{
          const bucket = ref(storage, path)
          const snapsort = await uploadBytes(bucket, file)
          const url = await getDownloadURL(snapsort.ref)
          return url
          
}
export default uploadFile