import createStore from 'react-waterfall'
import { User } from '~/Kit'
import { Promise } from 'core-js'

const config = {
  initialState: {
    user: new User(),
    message: null,
  },
  actionsCreators: {
    setUser: (state, actions, user) => ({ user }),
    setGlobalMessage: (state, actions, message) =>
      new Promise(resolve => setImmediate(() => resolve({ message }))),
  },
}

export const { Provider, connect, actions } = createStore(config)
