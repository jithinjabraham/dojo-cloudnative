var amqp = require('amqplib/callback_api');

const CONN_URL = 'amqp://rabbit';
const locations = [];
var connection = null;


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
        connection = conn;

        listen();
    });
}

function listen() {
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'location';

        channel.assertQueue(queue, {
            durable: true
        });
        channel.prefetch(1);
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        channel.consume(queue, function (msg) {
            var secs = msg.content.toString().split('.').length - 1;
            let data = JSON.parse(msg.content.toString());
            locations.push(data.city)
            console.log(" [x] Received %s", data.city);
            setTimeout(function () {
                console.log(" [x] Done");
                channel.ack(msg);
            }, secs * 1000);
        }, {

            noAck: false
        });
    });
}

start();

module.exports = { locations };