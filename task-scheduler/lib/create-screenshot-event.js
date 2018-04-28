const PubSub = require('@google-cloud/pubsub');
const logger = require('./../logger');

const pubsub = PubSub();
const topic = pubsub.topic(process.env.TOPIC_NAME);
const publisher = topic.publisher();

module.exports = async (url) => {
  logger.info(`Sending task: URL: ${url}`);
  try {
    const data = JSON.stringify({ url });
    const dataBuffer = Buffer.from(data);
    await publisher.publish(dataBuffer);
    logger.info(`Task sent: URL: ${url}`);
  } catch(err) {
    logger.error(err);
    return;
  }
}