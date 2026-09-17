const serializeError = (error) => ({
  name: error.name,
  message: error.message,
  code: error.code,
  reason: error.reason
});

const writeLog = (level, event, metadata = {}) => {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    event,
    ...metadata
  };

  console[level](JSON.stringify(entry));
};

module.exports = {
  info: (event, metadata) => writeLog('info', event, metadata),
  warn: (event, metadata) => writeLog('warn', event, metadata),
  error: (event, metadata) => writeLog('error', event, metadata),
  serializeError
};
