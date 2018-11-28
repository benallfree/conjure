import _ from 'lodash'
import { subscribe } from 'react-contextual'
import { guard } from './guard'

const ensureLoggedIn = options => {
  const config = _.defaults({}, options, {
    onFailed: props => {
      const {
        redirect,
        history,
        match,
        ioc: { routes },
      } = props
      if (redirect) {
        let url = null
        if (redirect === true) {
          url = routes.login({ r: match.url })
        } else {
          url = redirect(props)
        }
        setImmediate(() => history.replace(url))
      }
      return null
    },
    test: ({ ioc: { user } }) => {
      return typeof user.id !== 'undefined'
    },
    redirect: false,
  })
  return component => {
    return subscribe('ioc')(guard(config)(component))
  }
}

export { ensureLoggedIn }
