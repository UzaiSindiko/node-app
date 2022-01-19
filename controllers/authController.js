// const Post = require("../models/postModel")
const bcrypt = require("bcryptjs")
const User = require("../models/userModel")

exports.signUp = async (req, res, next) => {
  const { username, password } = req.body
  const hashPassword = await bcrypt.hash(password, 12)

  try {
    const newUser = await User.create({ username, password: hashPassword })
    req.session.user = newUser
    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    })
  } catch (err) {
    res.status(400).json({
      status: "fail",
      data: {
        err,
      },
    })
  }
}

exports.login = async (req, res, next) => {
  const { username, password } = req.body

  try {
    const user = await User.findOne({ username })

    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "user not found",
      })
    }

    const isCorrect = await bcrypt.compare(password, user.password)

    if (isCorrect) {
      req.session.user = user
      res.status(200).json({
        status: "success",
      })
    } else {
      res.status(400).json({
        status: "incorrect username or password",
      })
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      data: {
        err,
      },
    })
  }
}
