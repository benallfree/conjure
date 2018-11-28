import _ from 'lodash'
import { ensureLoggedIn } from './ensureLoggedIn'

const ensureLoggedOut = options => {
  const config = _.defaults({}, options, {
    test: ({ ioc: { user } }) => {
      return typeof user.id === 'undefined'
    },
  })
  return ensureLoggedIn(config)
}

export { ensureLoggedOut }
