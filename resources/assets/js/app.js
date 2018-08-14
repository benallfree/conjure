import React from 'react'
import ReactDOM from 'react-dom'
import './bootstrap'
import { Root } from './components/Root'
import '@fortawesome/fontawesome-free/css/all.css'
import 'semantic-ui-css/semantic.min.css'

const id = setInterval(() => {
  if (document.getElementById('react-root')) {
    clearInterval(id)
    ReactDOM.render(<Root />, document.getElementById('react-root'))
  }
}, 10)
