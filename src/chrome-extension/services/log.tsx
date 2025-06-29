type T_Log = (...args: unknown[]) => void;

// eslint-disable-next-line no-console
const log: T_Log = console.log.bind(console, 'WRITING TRAINER');

export default log;
