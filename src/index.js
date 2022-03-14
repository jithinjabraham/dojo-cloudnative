const app = require('./app.js');
const logger = require('./logger')
const PORT = process.env.PORT || 8000;

app.listen(PORT, () =>
    logger.info(`Server started and listening on port ${PORT}!`)
)