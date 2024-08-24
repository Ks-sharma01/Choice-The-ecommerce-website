const express = require("express")
const app = express()
const cors = require("cors")
const Razorpay = require("razorpay")
require("dotenv").config() 
const PORT = process.env.PORT || 8000

const key_id = process.env.key_id
const key_secret = process.env.key_secret
const instance = new Razorpay({
          key_id,
          key_secret
          // key_id: "rzp_test_xM02CBfMvhikdX",
          // key_secret: "hiJSS7f5WF6wFWQ1Q7SVCh26"
})

app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use(cors())

app.post('/order', async (req, res)=>{
          try {
                    const newOrder = await instance.orders.create({
                              amount: (req.body.amount*100),
                              receipt: 'CO_RP_'+ Date.now()
                    })
                    res.json({
                              amount: newOrder.amount,
                              orderId: newOrder.id
                    })
          } catch (error) {
                    res.status(500).json(error)
          }
})
app.get('/payments', async (req, res)=>{
          try {
                    const payments = await instance.payments.all()
                    res.json(payments)
          } catch (error) {
                    res.status(500).json(error)
          }
})

app.listen(PORT,()=>{
          console.log(`Listening in port ${PORT}`);
})