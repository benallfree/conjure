import moment from 'moment-timezone'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-contextual'
import axios from 'axios'
import '@fortawesome/fontawesome-free/css/all.css'
import 'semantic-ui-css/semantic.min.css'
import '../../sass/app.scss'
import { App } from './App'
moment.tz.setDefault('UTC')
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

function boot(Component, services) {
  const id = setInterval(() => {
    if (document.getElementById('react-root')) {
      clearInterval(id)

      ReactDOM.render(
        <App services={services}>
          <Component />
        </App>,
        document.getElementById('react-root'),
      )
    }
  }, 10)
}

export { boot }
