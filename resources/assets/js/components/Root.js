import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import _ from 'lodash'
import { routes } from '../routes'

const Root = () => (
  <Router>
    <div>
      <Route exact path="/" component={routes['/']} />
      {_.map(
        routes,
        (v, k) => (k === '/' ? null : <Route key={k} path={k} component={v} />),
      )}
    </div>
  </Router>
)

export { Root }
