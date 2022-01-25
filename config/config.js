const env = (name) => {
  const value = process.env[name]
  if (!value) console.log(`ERROR: env key "${name}" not found\n`)
  return value
}

module.exports = {
  twelveHoursDividedBy2minute: 360,
  jwtSecret: env("JWT_SECRET"),
  QRSecret: env("QR_SECRET"),
  secretKeySecret: env("SECRET_KEY_SECRET"),
  jobRetryTime: "in 1 second",
  maxJobRetries: 5,
}
