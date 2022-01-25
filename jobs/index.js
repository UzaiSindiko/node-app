const agenda = require("../connect/agenda")

require("./test")(agenda)
require("./callWebhookURL")(agenda)

module.exports = agenda
