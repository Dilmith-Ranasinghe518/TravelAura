const timestamp = () => new Date().toISOString();

const log = (...args) => {
  console.log(timestamp(), ...args);
};

const error = (...args) => {
  console.error(timestamp(), ...args);
};

const warn = (...args) => {
  console.warn(timestamp(), ...args);
};

// Only logs when DEBUG=true (or NODE_ENV !== 'production')
const debug = (...args) => {
  if (process.env.DEBUG === "true" || process.env.NODE_ENV !== "production") {
    console.debug(timestamp(), ...args);
  }
};

module.exports = { log, error, warn, debug };
