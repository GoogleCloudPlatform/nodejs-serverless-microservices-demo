const createTask = require('../lib/create-task').createTask

module.exports = (relative_url) => createTask(process.env.GOOGLE_CLOUD_PROJECT,
  process.env.QUEUE_LOCATION,
  process.env.QUEUE_ID,
  relative_url)