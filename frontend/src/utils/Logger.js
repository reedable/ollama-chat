export default function Logger(...namespace) {
  return Object.keys(console).reduce((logger, method) => {
    if (
      namespace &&
      namespace.length > 0 &&
      [
        'debug',
        'error',
        'info',
        'log',
        'warn',
        'trace',
        'group',
        'groupCollapsed',
      ].indexOf(method) !== -1
    ) {
      logger[method] = (...args) =>
        console[method](`[${namespace.join('-')}]`, ...args);
    } else {
      logger[method] = (...args) => console[method](...args);
    }

    return logger;
  }, {});
}
