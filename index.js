const express = require("express")
const mongoose = require("mongoose")
const session = require("express-session")
const redis = require("redis")
const cors = require("cors")
let RedisStore = require("connect-redis")(session)
const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_PORT,
  MONGO_IP,
  REDIS_URL,
  SESSION_SECRET,
  REDIS_PORT,
} = require("./config/config")
let redisClient = redis.createClient({
  host: REDIS_URL,
  port: REDIS_PORT,
})

const postRouter = require("./routes/postRoutes")
const userRoute = require("./routes/userRoute")

const app = express()

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`

mongoose
  .connect(mongoURL)
  .then(() => console.log(`success connect to database`))
  .catch((e) => console.log(e))

app.enable("trust proxy")
app.use(cors())

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: true,
      resave: false,
      saveUninitialized: true,
      maxAge: 60000,
    },
  })
)

app.use(express.json())

app.get("/api/v1/", (req, res) => {
  res.send("<h2>Hello World!</h2>")
})

app.use("/api/v1/posts", postRouter)
app.use("/api/v1/users", userRoute)

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`listening to port ${port}`))
