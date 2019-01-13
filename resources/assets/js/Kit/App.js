import React from 'react'
import { hot } from 'react-hot-loader'
import { Provider } from 'react-contextual'

const App = props => {
  const { services, children } = props
  return <Provider {...services}>{children}</Provider>
}

const HotApp = hot(module)(App)

export { HotApp as App }
