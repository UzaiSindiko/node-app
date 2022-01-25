if (process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "testing") {
  require("dotenv").config()
}
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const mongoose = require("mongoose")
const errorHandler = require("./middleware/errorHandler")

const app = express()

const PORT = process.env.PORT || 3000
const URI =
  process.env.URI ||
  "mongodb://127.0.0.1:27017/payment" + "_" + process.env.NODE_ENV

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())
app.use(morgan("dev"))

mongoose
  .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log(`SUCCESS: connect to mongodb`, URI)
  })
  .catch((err) => {
    console.log(`FAIL: connect to mongodb `, URI)
    console.log(err)
  })

// init mongoose model
require("./models")
require("./jobs")

const router = require("./routes")
const jobNames = require("./config/jobNames")

app.use("/api", router)

app.get("*/", (_, res, next) => {
  try {
    res.status(404).json("the route you looking for doesn't exist")
  } catch (err) {
    next(err)
  }
})

app.use(errorHandler)

app.listen(PORT, () => console.log(`this app is listening to port`, PORT))

module.exports = app
