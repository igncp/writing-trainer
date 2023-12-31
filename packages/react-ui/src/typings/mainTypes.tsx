import { T_Storage } from 'writing-trainer-core'

type T_getCurrentUrl = () => Promise<string>

interface T_Services {
  getCurrentUrl: T_getCurrentUrl
  storage: T_Storage
}

export { T_getCurrentUrl, T_Services }
