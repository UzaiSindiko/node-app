module.exports = (err, req, res, next) => {
  console.log(`================= ERROR ===================`)
  console.log(err)
  console.log(`================= ERROR ===================`)

  let status = err.status || 500
  let message = err.msg || "Internal Server Error"
  switch (err.name) {
    case "ValidationError": {
      const errors = []
      // eslint-disable-next-line no-undef
      for (key in err.errors) {
        // eslint-disable-next-line no-undef
        errors.push(err.errors[key].message)
      }
      status = 400
      message = errors
      break
    }
    case "CastError":
      status = 400
      message = err.message
      break
  }

  res.status(status).json({ success: false, status_code: status, message })
}
