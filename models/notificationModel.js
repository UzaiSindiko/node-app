const mongoose = require("mongoose")
const { ObjectId } = mongoose.Types

const notificationSchema = new mongoose.Schema(
  {
    business_id: {
      type: String,
      required: [true, "business_id is required"],
    },
    payment_id: {
      type: String,
      required: [true, "payment_id is required"],
    },
    business: {
      type: ObjectId,
      ref: "Business",
    },
    webhook_url: {
      type: String,
      required: [true, "webhook_url is required"],
    },
    status: {
      type: String,
      enum: ["STARTED", "INPROGRESS", "FAILED", "SUCCESS"],
    },
    retry_count: {
      type: Number,
      default: 0,
    },
    created: {
      type: Date,
    },
    amount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("Nof", notificationSchema)
