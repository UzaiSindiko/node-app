const mongoose = require("mongoose")

const businessSchema = new mongoose.Schema(
  {
    business_id: {
      type: String,
    },
    secretKey: {
      type: String,
    },
    webhook_url: {
      type: String,
      required: [true, "webhook_url is required"],
    },
    username: {
      type: String,
      required: [true, "user must have username"],
      validate: {
        validator: function (v) {
          return this.model("Business")
            .findOne({ username: v })
            .then((user) => !user)
        },
        message: (props) => `${props.value} is already used by another user`,
      },
    },
    password: {
      type: String,
      required: [true, "user must have password"],
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("Business", businessSchema)
