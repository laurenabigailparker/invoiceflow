import express from "express"
import Invoice from "../models/Invoice.js"

const router = express.Router()

// GET all invoices
router.get("/", async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 })
    res.json(invoices)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch invoices", error })
  }
})

// CREATE invoice
router.post("/", async (req, res) => {
  try {
    const newInvoice = await Invoice.create(req.body)
    res.status(201).json(newInvoice)
  } catch (error) {
    res.status(400).json({ message: "Failed to create invoice", error })
  }
})

// UPDATE invoice
router.put("/:id", async (req, res) => {
  try {
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.json(updatedInvoice)
  } catch (error) {
    res.status(400).json({ message: "Failed to update invoice", error })
  }
})

// DELETE invoice
router.delete("/:id", async (req, res) => {
  try {
    await Invoice.findByIdAndDelete(req.params.id)
    res.json({ message: "Invoice deleted" })
  } catch (error) {
    res.status(400).json({ message: "Failed to delete invoice", error })
  }
})

export default router