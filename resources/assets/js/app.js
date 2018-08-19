import React from 'react'
import ReactDOM from 'react-dom'
import './bootstrap'
import { AppContainer } from 'react-hot-loader'
import { Root } from './components/Root'
import '@fortawesome/fontawesome-free/css/all.css'
import 'semantic-ui-css/semantic.min.css'

const id = setInterval(() => {
  if (document.getElementById('react-root')) {
    clearInterval(id)

    const render = Component => {
      ReactDOM.render(
        <AppContainer>
          <Component />
        </AppContainer>,
        document.getElementById('react-root'),
      )
    }

    render(Root)

    if (process.env.NODE_ENV === 'development' && module.hot) {
      module.hot.accept('./components/Root', () => {
        render(Root)
      })
    }
  }
}, 10)
