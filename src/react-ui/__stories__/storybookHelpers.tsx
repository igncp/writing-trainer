import { T_Services } from '../typings/mainTypes'

const dummyServices: T_Services = {
  getCurrentUrl: () => Promise.resolve('currentUrlValue'),
  storage: {
    getValue: () => Promise.resolve(''),
    setValue: () => {},
  },
}

export { dummyServices }
