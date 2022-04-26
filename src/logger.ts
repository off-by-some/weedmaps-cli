import createLogger from "pino";

const logger = createLogger();

logger.level = process.env.LOG_LEVEL?.toLowerCase() ?? 'error';

export default logger;
export { logger };