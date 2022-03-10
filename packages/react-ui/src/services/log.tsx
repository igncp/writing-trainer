type T_Log = (...args: unknown[]) => void

const log: T_Log = console.log.bind(console, 'WRITING TRAINER')

export default log
