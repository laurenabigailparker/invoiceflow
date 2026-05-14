import mongoose from "mongoose"

const invoiceSchema = new mongoose.Schema(
  {
    client: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    amount: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Paid", "Pending", "Overdue"],
      default: "Pending",
    },

    due: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const Invoice = mongoose.model("Invoice", invoiceSchema)

export default Invoice