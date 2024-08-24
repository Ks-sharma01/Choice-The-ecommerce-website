import express from "express"
import Home from "./src/components/Home"
const app = express()

app.get("/",(req , res)=>{
          res.render(
          Home
          )
})
app.listen(8000,()=>{
          console.log("listening at 8000");
})