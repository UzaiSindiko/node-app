const agenda = require("../connect/agenda")
const config = require("../config/config")

module.exports = function (jobInfo, data) {
  // Retry a job if not retried more than a certain amount of time. Retry with highest priority
  if (data.retryCount >= config.maxJobRetries) {
    // send notification
  } else {
    agenda.schedule(
      config.jobRetryTime,
      jobInfo.name,
      {
        ...data,
        lastJobId: jobInfo.id,
        retryCount: data.retryCount ? data.retryCount + 1 : 1,
      },
      { priority: "highest" }
    )
  }
}
