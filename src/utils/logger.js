// src/utils/logger.js

const createLogger = (debugFlag) => {
  return {
    log: (...args) => {
      if (debugFlag) {
        console.log(...args);
      }
    },
    warn: (...args) => {
      if (debugFlag) {
        console.warn(...args);
      }
    },
    error: (...args) => {
      if (debugFlag) {
        console.error(...args);
      }
    },
    // Add other console methods as needed
  };
};

// __DEBUG__ is globally defined in vite.config.js
// eslint-disable-next-line no-undef
const logger = createLogger(__DEBUG__);

export default logger;
