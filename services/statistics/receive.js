var amqp = require('amqplib/callback_api');

const locations = [];
amqp.connect('amqp://localhost', function (error0, connection) {
    if (error0) {
        throw error0;
    }
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
});

module.exports = { locations };