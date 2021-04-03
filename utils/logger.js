const log = (level, data, obj) => {
  const logBody = {
    level,
  };
  if (data instanceof Error) {
    logBody.type = data.name;
    logBody.details = { message: data.message, stack: data.stack };
    console.log(JSON.stringify(logBody));
    return;
  }
  logBody.message = data;
  logBody.data = obj;
  console.log(JSON.stringify(logBody));
};

const info = (message, data) => log("INFO", message, data);
const warn = (message, data) => log("WARN", message, data);
const error = (err) => log("ERROR", err);

module.exports = {
  info,
  warn,
  error,
};
