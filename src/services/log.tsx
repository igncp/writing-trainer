type Log = (...args: unknown[]) => void

const log: Log = console.log.bind(console, 'WRITING TRAINER')

export default log
