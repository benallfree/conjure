import { User } from '~/Models'
import { routes } from '~/routes'
import { Api } from '~/Api'

const services = {
  routes,
  Api: new Api(),
  user: null,
  message: null,
  clearUser: () => state => ({ user: new User() }),
  setUser: user => state => ({ user }),
  setGlobalMessage: message => state =>
    new Promise(resolve => setImmediate(() => resolve({ message }))),
}

export { services }
