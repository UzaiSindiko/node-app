const axios = require("axios")
const mongoose = require("mongoose")
const Business = mongoose.model("Business")
const config = require("../config/config")
const helpers = require("../helpers")
const {
  checkType: { isString },
} = require("../helpers")

class BusinessController {
  static async register(req, res, next) {
    try {
      const { username, password, webhook_url } = req.body

      isString(username, password, webhook_url)

      // validate url here
      if (password.length < 8) {
        throw {
          status: 400,
          msg: "minimum password length is 8",
        }
      }

      if (
        !username.match(
          /^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/
        )
      ) {
        throw {
          status: 400,
          msg: "only alphanumeric characters is allowed for username",
        }
      }

      if (!webhook_url) {
        throw {
          status: 400,
          msg: "url is required",
        }
      }

      const isUsername = await Business.findOne({ username })
        .select("_id")
        .lean()

      if (isUsername) {
        throw {
          status: 400,
          msg: "username already registered",
        }
      }

      try {
        await axios({ method: "OPTIONS", url: webhook_url })
      } catch (err) {
        throw {
          status: 400,
          msg: "invalid webhook url",
        }
      }

      const user = await Business.create({
        username,
        password,
        webhook_url,
        password: helpers.bcrypt.hash(password),
      })

      const business_id = username + "__" + user._id
      user.business_id = business_id
      const secretKey = helpers.createSecretKey(user._id)
      user.secretKey = secretKey

      await Business.updateOne(
        {
          _id: user._id,
        },
        {
          secretKey,
          business_id,
        }
      )

      user.password = undefined

      const token = helpers.jwt.generateToken({
        id: user._id,
        username: user.username,
      })

      res.status(201).json({
        token,
        success: true,
        status_code: 201,
        data: user,
      })
    } catch (error) {
      next(error)
    }
  }

  static async login(req, res, next) {
    try {
      const { username, password } = req.body

      isString(username, password)

      const user = await Business.findOne({ username }).lean()

      if (!user) {
        throw {
          status: 403,
          msg: "incorrect username or password",
        }
      }

      const isPasswordCorrect = helpers.bcrypt.compare(password, user.password)
      if (!isPasswordCorrect) {
        throw {
          status: 403,
          msg: "incorrect username or password",
        }
      }

      const token = helpers.jwt.generateToken({
        id: user._id,
        username: user.username,
      })

      user.password = undefined

      res
        .status(200)
        .json({ token, success: true, status_code: 200, data: user })
    } catch (err) {
      next(err)
    }
  }

  static async updateBusiness(req, res, next) {
    try {
      const { username, webhook_url } = req.body

      const query = {}

      // validate url here

      if (username) {
        query.username = username
        if (
          !username.match(
            /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/
          )
        ) {
          throw {
            status: 400,
            msg: "only alphanumeric characters is allowed for username",
          }
        }
        const isUsername = await Business.findOne({
          _id: { $ne: req.user },
          username,
        })
          .select("_id")
          .lean()

        if (isUsername) {
          throw {
            status: 400,
            msg: "username already registered",
          }
        }
      }

      if (webhook_url) {
        query.webhook_url = webhook_url
        try {
          await axios({ method: "OPTIONS", url: webhook_url })
        } catch (err) {
          throw {
            status: 400,
            msg: "invalid webhook url",
          }
        }
      }

      const user = await Business.findOneAndUpdate(
        {
          _id: req.user,
        },
        {
          username,
          webhook_url,
        },
        {
          new: true,
        }
      )

      await Business.updateOne({
        business_id: username + user._id,
      })

      delete user.password

      const token = helpers.jwt.generateToken({
        id: user._id,
        username: user.username,
      })

      res
        .status(200)
        .json({ token, success: true, status_code: 200, data: user })
    } catch (error) {
      next(error)
    }
  }

  static async checkUrl(req, res, next) {
    try {
      const { id } = req.params

      const user = await Business.findOne({
        business_id: id,
      })
        .select("-password")
        .lean()

      if (!user) {
        throw {
          status: 404,
          msg: "not found",
        }
      }

      const payload = {
        payment_id: "test_id",
        amount: 1000,
        created: "2020-01-01T00:00:00.000Z",
      }

      try {
        const { data } = await axios({
          method: "POST",
          url: user.webhook_url,
          headers: {
            Signature: helpers.signature({
              payload: payload,
              secretKey: user.secretKey,
            }),
          },
          data: payload,
        })

        if (data.success !== true || data.status_code !== 200) {
          throw {
            status: data.status_code,
            msg: "invalid webhook url 1",
          }
        }
      } catch (error) {
        let status = 400
        if (error && error.response && error.response.status)
          status = error.response.status
        throw {
          status: status,
          msg: "invalid webhook url 2",
        }
      }

      res.status(200).json({ success: true, status_code: 200 })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = BusinessController
