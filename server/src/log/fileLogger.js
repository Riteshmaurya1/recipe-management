const fs = require("fs");
const path = require("path");

// Directly in project root: ./errors.log
const logFilePath = path.join(process.cwd(), "errors.log");

// No need for directory creation now, file will be created automatically

function logErrorToFile(err, req) {
  const logEntry = `
[${new Date().toISOString()}]
ENV: ${process.env.NODE_ENV || "development"}
URL: ${req?.originalUrl || "N/A"}
METHOD: ${req?.method || "N/A"}
STATUS: ${err.statusCode || err.status || 500}
MESSAGE: ${err.message}
STACK:
${err.stack || "no stack"}
-----------------------------
`;

  fs.appendFile(logFilePath, logEntry, (fileErr) => {
    if (fileErr) {
      console.error("Failed to write error log:", fileErr);
    }
  });
}

module.exports = { logErrorToFile };
