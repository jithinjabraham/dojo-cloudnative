var amqp = require('amqplib/callback_api');
const logger = require('./logger')

const CONN_URL = "amqp://localhost";
let ch = null;

amqp.connect(CONN_URL, function (err, conn) {
    if (err) {
        logger.error(err);
    }
    conn.createChannel(function (err, channel) {
        if (err) {
            logger.error(err);
        }
        ch = channel;
        logger.info(`RabbitMQ channel created`)
    });
});

const publishToQueue = async (queueName, data) => {
    let msgBuffer = Buffer.from(JSON.stringify(data));

    try {
        await ch.assertQueue(queueName);
        await ch.sendToQueue(queueName, msgBuffer);

    } catch (err) {
        logger.error(err);
    }
}
process.on('exit', (code) => {
    ch.close();
    logger.info(`Closing rabbitmq channel`)
});

module.exports = { publishToQueue };