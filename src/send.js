var amqp = require('amqplib/callback_api');
const logger = require('./logger')

const CONN_URL = "amqp://rabbit";
let ch = null;


function start() {
    amqp.connect(CONN_URL, function (err, conn) {
        if (err) {
            console.error("[AMQP]", err.message);
            return setTimeout(start, 1000);
        }
        conn.on("error", function (err) {
            if (err.message !== "Connection closing") {
                console.error("[AMQP] conn error", err.message);
            }
        });
        conn.on("close", function () {
            console.error("[AMQP] reconnecting");
            return setTimeout(start, 1000);
        });

        console.log("[AMQP] connected");

        conn.createChannel(function (err, channel) {
            if (err) {
                logger.error(err);
            }
            ch = channel;
            logger.info(`RabbitMQ channel created`)
        });
    });
}

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

start();

module.exports = { publishToQueue };