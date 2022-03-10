import { constants } from 'writing-trainer-core'

type T_getCurrentUrl = () => Promise<string>

interface T_Services {
  getCurrentUrl: T_getCurrentUrl
  storage: constants.T_Storage
}

export { T_Services, T_getCurrentUrl }
