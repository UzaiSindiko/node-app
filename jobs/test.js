const jobNames = require("../config/jobNames")

module.exports = function (agenda) {
  agenda.define(jobNames.TEST, function (job, done) {
    console.log(`testing purpose`, job.attrs.data)
    return done()
  })
}
