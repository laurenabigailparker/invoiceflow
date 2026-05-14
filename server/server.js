/* eslint-env node */

import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import invoiceRoutes from "./routes/invoiceRoutes.js"
import authRoutes from "./routes/authRoutes.js"



dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use("/api/invoices", invoiceRoutes)
app.use("/api/auth", authRoutes)

app.get("/", (req, res) => {
  res.send("InvoiceFlow API is running")
})

const PORT = process.env.PORT || 5000

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected")

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error)
  })