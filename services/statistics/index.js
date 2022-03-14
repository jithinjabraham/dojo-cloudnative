const app = require('./app.js');
const logger = require('./logger')

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {

    logger.info(`Statistics server started and listening on port ${PORT}!`);
})