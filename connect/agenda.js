const Agenda = require("agenda")

// agenda documentation https://github.com/agenda/agenda
const agenda = new Agenda({
  db: {
    address: "mongodb://127.0.0.1:27017/payment" + process.env.NODE_ENV,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    collection: "agenda",
  },
  maxConcurrency: 1000000, // Takes a number which specifies the max number of jobs that can be running at any given moment. By default it is 20.
  defaultConcurrency: 1000000, // Takes a number which specifies the default number of a specific job that can be running at any given moment. By default it is 5.
  processEvery: "1 seconds", // ?
})

agenda.on("ready", async function () {
  await agenda.start()
  console.log("SUCCESS: AgendaJS connected")
})

const graceful = () => {
  agenda.stop(function () {
    process.exit(0)
  })
}

process.on("SIGTERM", graceful)
process.on("SIGINT", graceful)

module.exports = agenda
