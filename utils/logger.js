// const winston = require("winston");

// const log = winston.createLogger({
//   format: winston.format.combine(
//     winston.format.simple(),
//     winston.format.timestamp(),
//     winston.format.printf((info) => {
//       const { timestamp, level, message, ...args } = info;
//       const formattedLog = {
//         level: level.toUpperCase(),
//         timestamp,
//         message,
//       };
//       if (Object.keys(args).length) formattedLog.data = args;
//       return JSON.stringify(formattedLog, null, 2);
//     })
//   ),
//   transports: [
//     new winston.transports.Console({
//       level: process.env.LOG_LEVEL,
//       colorize: true,
//       timestamp: () => new Date().toLocaleTimeString(),
//       prettyPrint: true,
//     }),
//   ],
// });

// module.exports = log;
